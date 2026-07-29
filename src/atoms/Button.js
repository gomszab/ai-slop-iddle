export class Button{

    #button;
    #updateCallback

    get button(){
        return this.#button;
    }

    constructor(id, text, cssClasses){
        this.#button = document.createElement('button');
        this.#button.className = cssClasses;
        this.#button.innerText = text;
        this.#button.id = id;
    }

    registerCallback(cb){
        this.#button.addEventListener('click', (e) => {
            console.log('click');
            cb(e);
        })
    }

    registerUpdateCallback(cb){
        this.#updateCallback = cb;
    }

    update(){
        if(this.#updateCallback){
            this.#updateCallback(this.#button);
        }
    }
}