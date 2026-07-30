import { GenericAtom } from "./GenericAtom.js";

export class Button extends GenericAtom{

    #updateCallback

    constructor(id, text, cssClasses){
        super('button', cssClasses);
        this.text = text;
        this.id = id;
    }

    registerCallback(cb){
        this.html.addEventListener('click', (e) => {
            cb(e);
        })
    }

    registerUpdateCallback(cb){
        this.#updateCallback = cb;
    }

    update(){
        if(this.#updateCallback){
            this.#updateCallback(this.html);
        }
    }
}