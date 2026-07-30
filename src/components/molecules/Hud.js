import { HudInfo } from "../atoms/HudInfo.js";
import { GenericMolecule } from "./GenericMolecule.js";

export class HUD extends GenericMolecule {
    constructor(){
        super('div', 'hud')
    }
}