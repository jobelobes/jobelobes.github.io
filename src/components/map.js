import Component from "../libs/Component";
import Rectangle from "../libs/Rectangle";
import Bounds from "../libs/Bounds";

export default class Map extends Component {

    constructor(width, height, unitWidth, unitHeight){
        super();

        this.width = width;
        this.height = height;
        this.unitWidth = unitWidth | 10;
        this.unitHeight = unitHeight | 10;
        this.elements = [[]];
    }

    onInitialize(engine){

        const maxX = Math.ceil(this.width / this.unitWidth);
        const maxY = Math.ceil(this.height / this.unitHeight);
        for(let x = 0; x < maxX; x++) {
            this.elements.push([]);
            for(let y = 0; y < maxY; y++) {
                const bounds = new Bounds(x * this.unitWidth, y * this.unitHeight, this.unitWidth, this.unitHeight);
                console.log(bounds.toString());
                const element = new Rectangle(bounds);
                this.elements[x].push(new Rectangle(bounds));
                engine.addObject(element);
            }
        }
    }

    onUpdate(engine, delta){

    }
}