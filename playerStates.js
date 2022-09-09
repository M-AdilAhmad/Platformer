const states = {
    ATTACK: 0,
    CLIMB: 1,
    DEAD: 2,
    GLIDE: 3,
    IDLE: 4,
    JUMP: 5,
    JUMP_ATTACK: 6,
    JUMP_THROW: 7,
    RUN: 8,
    SLIDE: 9,
    THROW: 10,
    FALL: 11
}

class State {
    constructor(state){
        this.state = state
    }
}

export class Idle extends State {
    constructor(player){
        super('IDLE')
        this.player = player
        this.maxFrame = 49
    }

    enter() {  
        this.player.weight = 1
        this.player.image = document.querySelectorAll('.playerSprite')[this.maxFrame-9]
        this.player.width = 232 * this.player.sizeModifier
        this.player.height = 439 * this.player.sizeModifier
    }

    handleInput(input) {
        if(input.includes('ArrowUp') && this.player.onGround()){
            this.player.setState(states.JUMP)
        }
        else if(input.includes('a') && this.player.onGround()){
            this.player.setState(states.ATTACK)
        }
        else if((input.includes('ArrowLeft') || input.includes('ArrowRight')) && this.player.onGround()){
            this.player.setState(states.RUN)
        }
    }
}

export class Run extends State {
    constructor(player){
        super('RUN')
        this.player = player
        this.maxFrame = 89
    }

    enter() {  
        this.player.image = document.querySelectorAll('.playerSprite')[this.maxFrame-9]
        this.player.width = 363 * this.player.sizeModifier
        this.player.height = 458 * this.player.sizeModifier
    }

    handleInput(input) {
        if(input.includes('ArrowUp') && this.player.onGround()){
            this.player.setState(states.JUMP)
        }
        else if(!input.includes('ArrowLeft') && !input.includes('ArrowRight')){
            this.player.setState(states.IDLE)
        }    
    }
}

export class Jump extends State {
    constructor(player){
        super('JUMP')
        this.player = player
        this.maxFrame = 59
    }

    enter() {  
        this.player.vy -= 22 
        this.player.image = document.querySelectorAll('.playerSprite')[this.maxFrame-9]
        this.player.width = 362 * this.player.sizeModifier
        this.player.height = 483 * this.player.sizeModifier
    }

    handleInput(input) {
        if(this.player.vy > this.player.weight){
            this.player.setState(states.FALL)
        }
        else if(input.includes('a')){  
            this.player.setState(states.JUMP_ATTACK)
        }
    }
}

export class Fall extends State {
    constructor(player){
        super('FALL')
        this.player = player
        this.maxFrame = 119
    }

    enter() {  
        this.player.image = document.querySelectorAll('.playerSprite')[this.maxFrame-9]
        this.player.width = 362 * this.player.sizeModifier
        this.player.height = 483 * this.player.sizeModifier
    }

    handleInput(input) {
        if(this.player.onGround()){
            this.player.setState(states.IDLE)
        }
        else if(input.includes('d')){
            this.player.setState(states.GLIDE)
        }
        else if(input.includes('a')){   
            this.player.setState(states.JUMP_ATTACK)
        }
    }
}

export class Glide extends State {
    constructor(player){
        super('GLIDE')
        this.player = player
        this.maxFrame = 39
    }

    enter() {  
        this.player.weight = 0.1
        this.player.image = document.querySelectorAll('.playerSprite')[this.maxFrame-9]
        this.player.width = 443 * this.player.sizeModifier
        this.player.height = 454 * this.player.sizeModifier
    }

    handleInput(input) {
        if(this.player.onGround()){
            this.player.setState(states.IDLE)
        }
    }
}

export class Attack extends State {
    constructor(player){
        super('ATTACK')
        this.player = player
        this.maxFrame = 9
        this.offset = 66
    }

    enter() {  
        this.player.image = document.querySelectorAll('.playerSprite')[this.maxFrame-9]
        this.player.width = 536 * this.player.sizeModifier
        this.player.height = 495 * this.player.sizeModifier
        if(this.player.facing=='left') this.player.x -= this.offset
    }

    handleInput(input) {
        const currentFrame = Array.from(document.querySelectorAll('.playerSprite')).indexOf(this.player.image)
        if(currentFrame >= this.maxFrame){
            if(this.player.facing=='left') this.player.x += this.offset
            this.player.setState(states.IDLE)
        }
    }
}

export class Jump_Attack extends State {
    constructor(player){
        super('JUMP_ATTACK')
        this.player = player
        this.maxFrame = 69
        this.offset = 40
    }

    enter() {  
        this.player.image = document.querySelectorAll('.playerSprite')[this.maxFrame-9]
        this.player.width = 504 * this.player.sizeModifier
        this.player.height = 522 * this.player.sizeModifier
        if(this.player.facing=='left') this.player.x -= this.offset
    }

    handleInput(input) {
        const currentFrame = Array.from(document.querySelectorAll('.playerSprite')).indexOf(this.player.image)
        if(this.player.onGround()){
            if(this.player.facing=='left') this.player.x += this.offset
            this.player.setState(states.IDLE)
        }
        else if(currentFrame >= this.maxFrame){
            if(this.player.facing=='left') this.player.x += this.offset
            this.player.setState(states.FALL)
        }
    }
}