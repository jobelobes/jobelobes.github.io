export default class Component {

    constructor() {
        this.isInitialized = false;
    }

    onInitialize(engine){

    }

    update(engine, delta){
        if(!this.isInitialized){
            this.onInitialize(engine);
            this.isInitialized = true;
        }
        
        this.onUpdate(engine, delta);
    }

    onUpdate(engine, delta){

    }
}