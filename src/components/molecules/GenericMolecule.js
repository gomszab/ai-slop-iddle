import { GenericAtom } from "../atoms/GenericAtom.js";

export class GenericMolecule {

    #html;
    /**
     * @type {GenericAtom[]}
     */
    #elementList;

    get html(){
        return this.#html;
    }
    /**
     * 
     * @param {GenericAtom[]} pillList 
     */
    constructor(tag, className){
        this.#html = document.createElement(tag);
        this.#html.className = className;
        this.#elementList = []
        this.mountItems();
    }

    /**
     * 
     * @param {GenericAtom[]} elementList 
     */
    setElementList(elementList){
        this.#elementList = elementList;
        this.mountItems();
    }

    mountItems(){
        this.#html.replaceChildren(...this.#elementList.map(element => element.html));
    }

    rerender(){
        this.#elementList.forEach(element => element.update());
    }
}