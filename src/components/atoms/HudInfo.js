export class HudInfo {
    #text;
    #div;
    #cb;

    get div(){
        return this.#div;
    }
    /**
     * 
     * @param {string} text 
     * @param {updateCallback} cb 
     */
    constructor(text, cb){
        this.#text = text;
        this.#div = document.createElement('div');
        this.#div.className = 'pill';
        this.#div.appendChild(this.#createText(0));
        this.#cb = cb;
    }

    #createText(value){
        const small = document.createElement('small');
        small.innerText = this.#text;
        const bold = document.createElement('b');
        bold.innerText = value;
        small.appendChild(bold)
        return small;
    }

    update(){
        this.#div.innerHTML = '';
        this.#div.appendChild(this.#createText(this.#cb()))
    }
}