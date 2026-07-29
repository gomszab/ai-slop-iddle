import { Button } from "../atoms/Button.js";
import { BrandMark } from "../atoms/GameTitle.js";
import { HudInfo } from "../atoms/HudInfo.js";
import { HUD } from "../molecules/hud.js";
import { Navbar } from "../molecules/Navbar.js";

const testState = {
    money: 15,
    id: 'board'
}
/**
 * @type {{text: string, cb: () => number}[]}
 */
const hudElements = [
    {
        text: 'Pénz',
        cb: () => testState.money
    },
    {
        text: 'Biom token',
        cb: () => 0
    },
    {
        text: 'Tojások',
        cb: () => 0
    },
    {
        text: 'Teknősök',
        cb: () => 0
    },{
        text: 'Ritkák',
        cb: () => 0
    },
    ,{
        text: 'Biom',
        cb: () => 0
    },
]

/**
 * @type {{id: string, text: string, cssClass: string}[]}
 */
const navbarButtons = [{
    id: 'board',
    text: 'Board',
    cssClass: 'tab active',
},
{
    id: 'hunt',
    text: 'Teknősvadászat',
    cssClass: 'tab',
},
{
    id: 'store',
    text: 'Store',
    cssClass: 'tab',
}]

const buttonUbdateCb = (button) => {
    if(button.id !== testState.id){
        button.classList.remove('active');
    }else{
        button.classList.add('active');
    }
}

const navbarButtonCb = (e) => {
    testState.id = e.target.id;
}

export class Header {
    #div;
    #hud;
    #navbar;

    get div(){
        return this.#div;
    }

    constructor(){
        const header = document.createElement('header');
        this.#div = header;
        const inner = document.createElement('topbar-inner');
        header.appendChild(inner);

        const gameTitle = new BrandMark();
        inner.appendChild(gameTitle.div);
        const hud = new HUD(hudElements.map(e => new HudInfo(e.text, e.cb)))
        inner.appendChild(hud.div);
        this.#hud = hud;
        const button = new Button('themeBtn','◐','theme-btn');
        button.registerCallback((e) => {
            const themeBtn = e.target;
            const root = document.documentElement;
             root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
             themeBtn.textContent = root.getAttribute('data-theme') === 'dark' ? '☀' : '◐';
        })
        inner.appendChild(button.button)
        
        const navbar = new Navbar(navbarButtons.map(n => {
            const button = new Button(n.id, n.text, n.cssClass)
            button.registerCallback(navbarButtonCb);
            button.registerUpdateCallback(buttonUbdateCb)
            return button;    
        })
        )
        this.#navbar = navbar;
        header.appendChild(navbar.nav);
    }

    rerender(){
        this.#hud.rerender();
        this.#navbar.rerender()
    }
}