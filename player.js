import {Attack, Glide, Idle, Jump, Run, Jump_Attack, Fall} from './playerStates.js'

export class Player {
    constructor(game) {
        this.game = game
        this.sizeModifier = 0.25
        this.width = 232 * this.sizeModifier
        this.height = 439 * this.sizeModifier
        this.x = 200
        this.y = this.game.height - this.height - this.game.foreground.tiles[0].height 
        this.vy = 0
        this.weight = 1
        this.facing = 'right'
        this.image = document.querySelectorAll('.playerSprite')[40]
        this.fps = 30
        this.frameInterval = 1000/this.fps
        this.frameTimer = 0
        this.speed = 0
        this.maxSpeed = 10
        this.states = [new Attack(this),null,null,new Glide(this),new Idle(this),new Jump(this),new Jump_Attack(this),null,new Run(this),null,null,new Fall(this)]
        this.currentState = this.states[4]
        this.currentState.enter()
    }

    update(input, deltaTime) {
        this.currentState.handleInput(input)
        // horizontal movement
        this.x += this.speed
        if(input.includes('ArrowLeft') && this.currentState.state != 'ATTACK'){
            this.speed = -this.maxSpeed
            this.facing = 'left'
        }
        else if(input.includes('ArrowRight') && this.currentState.state != 'ATTACK'){
            this.speed = this.maxSpeed
            this.facing = 'right'
        }
        else this.speed = 0
        // horizontal boundary
        if(this.x < 0) this.x = 0
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width
        // vertical movement
        this.y += this.vy
        //if(!this.onGround()) this.vy += this.weight
        if(!this.onGround() || this.currentState.state=='JUMP' || this.currentState.state=='FALL') this.vy += this.weight
        else this.vy = 0
        // tile boundary
        const tiles = this.game.foreground.tiles
        tiles.forEach((tile)=>{
            let P1 = {x: tile.x, y:tile.y, insidePlayer:false}
            let P2 = {x: tile.x+tile.width, y:tile.y, insidePlayer:false}
            let P3 = {x: tile.x, y:tile.y+tile.height, insidePlayer:false}
            let P4 = {x: tile.x+tile.width, y:tile.y+tile.height, insidePlayer:false}
            let vertices = [P1,P2,P3,P4]
            
            vertices.forEach((vertex)=>{
                if(this.x < vertex.x && vertex.x < this.x+this.width && this.y < vertex.y && vertex.y < this.y+this.height){
                    vertex.insidePlayer = true
                }
            })

            if(vertices.filter(vertex => vertex.insidePlayer).length==2){
                if(P1.insidePlayer && P2.insidePlayer){
                    this.y = tile.y - this.height
                }
                else if(P3.insidePlayer && P4.insidePlayer){
                    this.y = tile.y + tile.height 
                    this.vy = 0
                }
                else if(P1.insidePlayer && P3.insidePlayer){
                    this.x = tile.x - this.width  
                }
                else if(P2.insidePlayer && P4.insidePlayer){
                    this.x = tile.x + tile.width 
                }
            }
            else if(vertices.filter(vertex => vertex.insidePlayer).length==1){
                let dx
                let dy

                if(P1.insidePlayer){
                    dx = Math.abs(P1.x - (this.x+this.width))
                    dy = Math.abs(P1.y - (this.y+this.height))
                }
                else if(P2.insidePlayer){
                    dx = Math.abs(P2.x - this.x)
                    dy = Math.abs(P2.y - (this.y+this.height))
                }
                else if(P3.insidePlayer){
                    dx = Math.abs(P3.x - (this.x+this.width))
                    dy = Math.abs(P3.y - this.y)
                }
                else if(P4.insidePlayer){
                    dx = Math.abs(P4.x - this.x)
                    dy = Math.abs(P4.y - this.y)
                }
            
                if(dx>dy){
                    if(P3.insidePlayer || P4.insidePlayer) this.y += dy
                    else if(P1.insidePlayer || P2.insidePlayer) this.y -= dy
                }
                else if(dx<dy){
                    if(P2.insidePlayer || P4.insidePlayer) this.x += dx
                    else if(P1.insidePlayer || P3.insidePlayer) this.x -= dx
                }
            }

            // Alternative I tried but also failed!
            // if(tile.x < this.x + this.width && tile.x + tile.width > this.x && tile.y < this.y + this.height && tile.y + tile.height > this.y){
            //     if(this.vy < this.weight && !this.onGround()){
            //         this.y = tile.y + tile.height
            //         this.vy = 0
            //     }
            //     else if(this.currentState.state=='IDLE'){
            //         this.y = tile.y - this.height
            //     }
            //     else if(this.speed > 0 && !this.onGround()){
            //         this.x = tile.x - this.width 
            //     }
            //     else if(this.speed < 0 && !this.onGround()){
            //         this.x = tile.x + tile.width 
            //     }
            // }
        })
        // sprite animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0
            const currentFrame = Array.from(document.querySelectorAll('.playerSprite')).indexOf(this.image)
            if(currentFrame < this.currentState.maxFrame) this.image = document.querySelectorAll('.playerSprite')[currentFrame+1]
            else this.image = document.querySelectorAll('.playerSprite')[this.currentState.maxFrame-9]
        }   
        else{
            this.frameTimer += deltaTime
        }
    }

    draw(context) {                 
        context.strokeRect(this.x,this.y,this.width,this.height)    // debug
        if(this.facing=='left'){
            context.save()
            context.translate(this.width + this.x, 0)
            context.scale(-1, 1)
            context.drawImage(this.image, 0, this.y, this.width, this.height)
            context.restore()
        }
        else{
            context.drawImage(this.image,this.x,this.y,this.width,this.height)
        }
    }

    onGround(){
        const tiles = this.game.foreground.tiles
        let result = false

        tiles.forEach((tile)=>{
            const X_test = (this.x < tile.x && (this.x+this.width) > tile.x) || (this.x < (tile.x+tile.width) && (this.x+this.width) > (tile.x+tile.width))
            const Y_test = (tile.y - (this.y+this.height) <= 0) && (tile.y - (this.y+this.height) >= -tile.height)

            if(X_test && Y_test){
                result = true
            }
        })
      
        return result
    }

    setState(state){
        this.currentState = this.states[state]
        this.currentState.enter()
    }
}