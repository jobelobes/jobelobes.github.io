import Component from "./Component";
import Drawable from "./Drawable";


export class ThreeEngine {

    constructor(containerId) {

        this.container = document.getElementById(containerId);
        if(this.container == null){
            throw new Error('Failed to located container "' + containerId + '"');
        }

        this.drawingPlane = document.createElement('canvas');
        this.drawingPlane.width = window.innerWidth;
        this.drawingPlane.height = window.innerHeight;
        this.container.appendChild(this.drawingPlane);
        
        this.components = [];
        this.drawables = [];
    }

    addObject(gameObj){
        if(gameObj instanceof Component){
            this.components.push(gameObj);
        }

        if(gameObj instanceof Drawable){
            this.drawables.push(gameObj);
        }
        return this;
    }
    run(count) {
        window.requestAnimationFrame(this.loop.bind(this, (count ? count : -1), null))
    }

    stop() {
        window.requestAnimationFrame(null);
    }

    update(delta){
        if(!(this.components) || this.components.length == 0){
            return;
        }

        console.log('Updating ' + this.components.length + ' elements');
        this.components.forEach(item => item.update(this, delta));
    }

    draw(delta) {
        if(!(this.drawables) || this.drawables.length == 0){
            return;
        }
        
        console.log('Drawing ' + this.drawables.length + ' elements');
        const context = this.drawingPlane.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();
        this.drawables.forEach(item => item.draw(context));
    }

    loop(count, previousTimeStamp, timestamp) {

        const delta = timestamp - (previousTimeStamp == null ? timestamp : previousTimeStamp);

        console.info('MS: ' + delta.toFixed(2) + ' FPS: ' + Math.round(1.0/(delta/1000.0)) + (count != -1 ? ' Count: ' + count : ''))

        this.update(delta);
        this.draw(delta);

        if((--count) != 0){
            window.requestAnimationFrame(this.loop.bind(this, Math.max(-1, count), timestamp));
        }
    }
}