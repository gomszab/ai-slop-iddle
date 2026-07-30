export class HelpStep {
    #div;

    constructor(num, text){
        const div = document.createElement('div');
        div.className = 'help-step';
        const numberDiv = document.createElement('div')
        numberDiv.className = 'step-badge';
        numberDiv.textContent = num;
        div.appendChild(numberDiv);

        const textDiv = document.createElement('div');
        textDiv.innerHTML = text;
        div.appendChild(textDiv);
        this.#div = div;
    }

    get div(){
        return this.#div;
    }
}