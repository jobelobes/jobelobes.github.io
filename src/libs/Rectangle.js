import Drawable from "./Drawable";
import Bounds from "./Bounds";

export default class Rectangle extends Drawable {

    constructor(bounds){
        super();

        this.bounds = bounds;
    }
    
    moveTo(x, y){
        this.bounds.setX(x);
        this.bounds.setY(y);
    }

    onDraw(context){
        context.strokeStyle = "#FF0000";
        context.fillStyle = "#FF0000";
        context.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        context.fill();

        console.log('[Rectangle]: ' + this.bounds.toString())
    }
}