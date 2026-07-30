import { GenericAtom } from "./GenericAtom.js";

export class LegendRow extends GenericAtom{

    constructor(color, name){
        super('div', 'legend-row');

        const dotSpan = document.createElement('span');
        dotSpan.className = 'dot';
        dotSpan.style.background = color;
        this.appendChild(dotSpan);
        this.text = name;
    }
}