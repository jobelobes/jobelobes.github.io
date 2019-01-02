import Drawable from "./Drawable";

export default class Sprite extends Drawable {

    constructor(){
        super();
    }

    onDraw(context, delta){
        context.rect(20, 20, 20, 20);
        context.stroke();
    }
}