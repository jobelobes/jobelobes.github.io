export default class Bounds {

    constructor(x, y, width, height){
        this.updateBounds(x, y, width, height);
    }

    updateBounds(x, y, width, height) {
        this.x = this.left = x;
        this.y = this.top = y;
        this.width = width;
        this.height = height;

        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height
    }

    setX(x){
        this.updateBounds(x, this.y, this.width, this.height);
    }

    setLeft(left){
        this.updateBounds(left, this.y, this.width, this.height);
    }

    setRight(right){
        this.updateBounds(right - this.width, this.y, this.width, this.height);
    }

    setY(y){
        this.updateBounds(this.x, y, this.width, this.height);
    }

    setTop(top){
        this.updateBounds(this.x, top, this.width, this.height);
    }

    setBottom(bottom){
        this.updateBounds(this.x, bottom - this.height, this.width, this.height);
    }

    setWidth(width){
        this.updateBounds(this.x, this.y, width, this.height);
    }

    setHeight(height){
        this.updateBounds(this.x, this.y, this.width, height);
    }

    toString(){
        return '{left:' + this.left + ', top:' + this.top + ', right:' + this.right + ', bottom: ' + this.bottom + '}';
    }
}