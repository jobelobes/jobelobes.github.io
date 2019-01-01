export class ThreeEngine {
    run() {
        window.requestAnimationFrame(this.loop.bind(this, null))
    }

    stop() {
        window.requestAnimationFrame(null);
    }

    update(delta){
        console.log('Updating...');
    }

    draw(delta) {
        console.log('Drawing...');
    }

    loop(previousTimeStamp, timestamp) {
        let delta = timestamp - (previousTimeStamp == null ? timestamp : previousTimeStamp);

        console.info('MS: ' + delta.toFixed(2) + ' FPS: ' + Math.round(1.0/(delta/1000.0)))

        this.update(delta);
        this.draw(delta);

        window.requestAnimationFrame(this.loop.bind(this, timestamp))
    }
}