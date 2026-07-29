import { HudInfo } from "./atoms/HudInfo.js"
import { HUD } from "./molecules/Hud.js"
import { Header } from "./organism/Header.js";



const hud = new Header()
document.querySelector('.testMol').appendChild(hud.div);
hud.rerender()