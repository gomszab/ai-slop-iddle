export class BoxDesc{

    #desc

    constructor(text){
        this.#desc = document.createElement('p');
        this.#desc.className = 'muted';
        this.#desc.innerText = text;
    }

    get desc() {
        return this.#desc;
    }
}