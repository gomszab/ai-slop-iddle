import BrandLogo from '../svg/logo.js'

export class BrandMark {
    #div;

    constructor(){
        this.#div = document.createElement('div');
        this.#div.className = 'brand';

        const logo = document.createElement('div');
        logo.className = 'brand-mark';
        logo.ariaHidden = true;
        logo.innerHTML = BrandLogo;
        this.#div.appendChild(logo);

        const name = document.createElement('div');
        this.#div.appendChild(name);
        const title = document.createElement('div');
        title.innerText = 'Teknős Tenyésztő';

        name.appendChild(title);
    }

    get div(){
        return this.#div;
    }
}