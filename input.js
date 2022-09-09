export class InputHandler {
    constructor() {
        this.keys = []
        window.addEventListener('keydown',(e)=>{
            if((e.key=='ArrowLeft' || e.key=='ArrowUp' || e.key=='ArrowDown' || e.key=='ArrowRight' || e.key=='a' || e.key=='s' || e.key=='d') && !this.keys.includes(e.key)){
                this.keys.push(e.key)
            }
        })
        window.addEventListener('keyup',(e)=>{
            if((e.key=='ArrowLeft' || e.key=='ArrowUp' || e.key=='ArrowDown' || e.key=='ArrowRight' || e.key=='a' || e.key=='s' || e.key=='d') && this.keys.includes(e.key)){
                this.keys.splice(this.keys.indexOf(e.key),1)
            }
        })
    }
}