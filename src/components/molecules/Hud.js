import { HudInfo } from "../atoms/HudInfo.js";

export class HUD {

    #div;
    #pillList;

    get div(){
        return this.#div;
    }
    /**
     * 
     * @param {HudInfo[]} pillList 
     */
    constructor(pillList = []){
        this.#div = document.createElement('div');
        this.#div.className = 'hud';
        this.#pillList = pillList
        this.mountItems();
    }

    setItems(pillList){
        this.#pillList = pillList;
        this.mountItems();
    }

    mountItems(){
        this.#div.replaceChildren(...this.#pillList.map(pill => pill.div));
    }

    rerender(){
        this.#pillList.forEach(p => p.update());
    }
}