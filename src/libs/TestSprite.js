import Component from "./Component";
import Sprite from "./Sprite";
import Rectangle from "./Rectangle";
import Bounds from "./Bounds";

export default class TestSprite extends Component {

    constructor(){
        super();
        this.xAccel = 166;
        this.yAccel = 1066;

        this.drawables = null;
    }

    onInitialize(engine){
        
        this.body = new Rectangle(new Bounds(0, 0, 50, 50));

        engine.addObject(this.body);
    }

    onUpdate(engine, delta){

        this.body.bounds.setX(this.body.bounds.x + (delta/1000.0) * this.xAccel)
        this.body.bounds.setY(this.body.bounds.y + (delta/1000.0) * this.yAccel)

        if(this.body.bounds.left < 0){
            this.body.bounds.setLeft(this.body.bounds.left * -1);
            this.xAccel *= -1;
        }
        if(this.body.bounds.top < 0){
            this.body.bounds.setTop(this.body.bounds.top * -1);
            this.yAccel *= -1;
        }

        if(this.body.bounds.right > engine.drawingPlane.width){
            this.body.bounds.setRight(engine.drawingPlane.width - (this.body.bounds.right - engine.drawingPlane.width));
            this.xAccel *= -1;
        }
        
        if(this.body.bounds.bottom > engine.drawingPlane.height){
            this.body.bounds.setBottom(engine.drawingPlane.height - (this.body.bounds.bottom - engine.drawingPlane.height));
            this.yAccel *= -1;
        }
    }
}