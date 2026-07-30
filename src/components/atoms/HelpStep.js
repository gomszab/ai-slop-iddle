import { GenericAtom } from "./GenericAtom.js";

export class HelpStep extends GenericAtom {
    constructor(num, text){
        super('div', 'help-step');
        const numberDiv = document.createElement('div')
        numberDiv.className = 'step-badge';
        numberDiv.textContent = num;
        this.appendChild(numberDiv);

        const textDiv = document.createElement('div');
        textDiv.innerHTML = text;
        this.appendChild(textDiv);
    }
}