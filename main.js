import {Player} from './player.js'
import {InputHandler} from './input.js'
import {Foreground} from './foreground.js'

const loadImages = ()=> {
    let html = ''

    const playerSprites = ['Attack__00','Climb_00','Dead__00','Glide_00','Idle__00','Jump__00','Jump_Attack__00','Jump_Throw__00','Run__00','Slide__00','Throw__00','Fall__00']
    playerSprites.forEach((spriteType)=>{
        for(let i=0; i<=9; i++){
            html += `<img src='images/Ninja/${spriteType}${i}.png' class='playerSprite'>`
        }
    })

    for(let i=1; i<=16; i++){
        html += `<img src='images/Tiles/Tile (${i}).png' class='tile'>`
    }

    document.querySelector('#canvas1').insertAdjacentHTML('afterend', html)
}

loadImages()

window.addEventListener('load', ()=>{
    const canvas = document.querySelector('#canvas1')
    const ctx = canvas.getContext('2d')
    const sizeModifier = 0.6
    canvas.width = 2000 * sizeModifier
    canvas.height = (1143-10) * sizeModifier
    canvas.style.visibility = 'visible'

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.foreground = new Foreground()
            this.player = new Player(this)
            this.input = new InputHandler()
        }

        update(deltaTime) {
            this.player.update(this.input.keys, deltaTime)
        }

        draw(context) {
            this.foreground.draw(context)
            this.player.draw(context) 
        }
    }

    const game = new Game(canvas.width,canvas.height)
    let lastTime = 0

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0,0,canvas.width,canvas.height)
        game.update(deltaTime)
        game.draw(ctx)
        requestAnimationFrame(animate)
    }

    animate(0)
})