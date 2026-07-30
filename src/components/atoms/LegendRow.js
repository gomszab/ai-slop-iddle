export class LegendRow{
    #div;

    constructor(color, name){
        const div = document.createElement('div');
        div.className = 'legend-row';

        const dotSpan = document.createElement('span');
        dotSpan.className = 'dot';
        dotSpan.style.background = color;
        div.appendChild(dotSpan);
        div.innerText = name;
        this.#div =div;
    }

    get div(){
        return this.#div;
    }
}