import { GenericAtom } from "./GenericAtom.js";

export class HudInfo extends GenericAtom {
    #text;
    #cb;

    /**
     * 
     * @param {string} text 
     * @param {updateCallback} cb 
     */
    constructor(text, cb) {
        super('div', 'pill');
        this.#text = text;
        this.appendChild(this.#createText(0));
        this.#cb = cb;
    }

    #createText(value) {
        const small = document.createElement('small');
        small.innerText = this.#text;
        const bold = document.createElement('b');
        bold.innerText = value;
        small.appendChild(bold)
        return small;
    }

    update() {
        this.clear();
        this.appendChild(this.#createText(this.#cb()));
    }
}