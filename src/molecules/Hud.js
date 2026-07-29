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
    constructor(pillList){
        this.#div = document.createElement('div');
        this.#div.className = 'hud';
        pillList.forEach(pill => {
            this.#div.appendChild(pill.div);
        })
        this.#pillList = pillList
    }

    rerender(){
        this.#pillList.forEach(p => p.update());
    }
}