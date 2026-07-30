import { BoxDesc } from "../atoms/BoxDesc.js";
import { BoxTitle } from "../atoms/BoxTitle.js";

export class Panel {
    constructor(tag, title, description, molecules){
        const container = document.createElement(tag);
        const title = new BoxTitle(title, 'large');
        container.appendChild(title.html);
        const description = new BoxDesc(description);
        molecules.forEach(m => {
            container.appendChild(m.html)
        })
    }
}