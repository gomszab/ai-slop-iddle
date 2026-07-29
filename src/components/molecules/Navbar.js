import { Button } from "../atoms/Button.js";

export class Navbar{
    #nav;
    #buttonList;
    /**
     * 
     * @param {Button[]} buttonList 
     */
    constructor(buttonList){
        const nav = document.createElement('nav');
        nav.className = 'tabs';
        this.#nav = nav;
        this.#buttonList = buttonList;
        this.mountItems();
    }

    setItems(buttonList){
        this.#buttonList = buttonList;
        this.mountItems();
    }

    mountItems(){
        this.#nav.replaceChildren(...this.#buttonList.map(b => b.button));
    }

    get nav(){
        return this.#nav;
    }

    rerender(){
        this.#buttonList.forEach(b => b.update());
    }
}