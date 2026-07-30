import { Button } from "../atoms/Button.js";
import { GenericMolecule } from "./GenericMolecule.js";

export class Navbar extends GenericMolecule{

    constructor(){
        super('nav', 'tabs');
    }
}