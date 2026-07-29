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
        buttonList.forEach(b => nav.appendChild(b.button))
        this.#nav = nav;
        this.#buttonList = buttonList;
    }

    get nav(){
        return this.#nav;
    }

    rerender(){
        this.#buttonList.forEach(b => b.update());
    }
}