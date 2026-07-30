export class GenericAtom {
    #html;

    get html(){
        return this.#html;
    }

    set text(value){
        this.#html.innerText = value;
    }

    set id(value){
        this.#html.id = value;
    }

    constructor(tag, classes){
        this.#html = document.createElement(tag)
        this.#html.className = classes
    }

    update(){}

    appendChild(element){
        this.html.appendChild(element);
    }

    clear(){
        this.html.innerHTML = '';
    }
}