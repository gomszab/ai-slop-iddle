import { Button } from "../../../components/atoms/Button.js";
import { BrandMark } from "../../../components/atoms/GameTitle.js";
import { HudInfo } from "../../../components/atoms/HudInfo.js";
import { HUD } from "../../../components/molecules/hud.js";
import { Navbar } from "../../../components/molecules/Navbar.js";

const testState = {
    money: 15,
    id: 'board'
}


export class Header {
    #div;
    #hud;
    #navbar;
    #controller;
    #unsubscribe;

    get div() {
        return this.#div;
    }

    constructor(controller) {
        this.#controller = controller;

        const header = document.createElement("header");
        this.#div = header;

        const inner = document.createElement("div");
        inner.className = "topbar-inner";
        header.appendChild(inner);

        const gameTitle = new BrandMark();
        inner.appendChild(gameTitle.div);

        this.#hud = new HUD();
        inner.appendChild(this.#hud.html);

        const themeButton = new Button("themeBtn", "◐", "theme-btn");
        themeButton.registerCallback(() => {
            const root = document.documentElement;
            const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            root.setAttribute("data-theme", next);
            themeButton.button.textContent = next === "dark" ? "☀" : "◐";
        });
        inner.appendChild(themeButton.html);

        this.#navbar = new Navbar();
        header.appendChild(this.#navbar.html);

        this.#unsubscribe = this.#controller.subscribe(() => this.rerender());
    }

    async init() {
        await this.#controller.init();

        const hudItems = this.#controller.getHudElements().map(item =>
            new HudInfo(item.text, () => this.#controller.getHudValue(item.id))
        );
        this.#hud.setElementList(hudItems);

        const navButtons = this.#controller.getNavbarElements().map(item => {
            const button = new Button(item.id, item.text, "tab");

            button.registerCallback(async () => {
                await this.#controller.changeScreen(item.id);
            });

            button.registerUpdateCallback(btn => {
                btn.classList.toggle("active", this.#controller.isNavbarActive(item.id));
            });

            return button;
        });

        this.#navbar.setElementList(navButtons);
        this.rerender();
    }

    rerender() {
        this.#hud.rerender();
        this.#navbar.rerender()
    }
}