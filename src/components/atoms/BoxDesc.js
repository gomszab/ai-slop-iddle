import { GenericAtom } from "./GenericAtom.js";

export class BoxDesc extends GenericAtom{

    constructor(text){
        super('p', 'muted');
        this.text = text;
    }
}