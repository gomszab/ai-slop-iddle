// main.js
import { Header } from "./features/header/ui/Header.js";
import { HeaderController } from "./features/header/controller/HeaderController.js";
import { MockUiState } from "./state/game/MockUiState.js";
import { MockGameState } from "./state/game/MockGameState.js";

const uiState = new MockUiState();
const gameState = new MockGameState();
const controller = new HeaderController(uiState, gameState);
const header = new Header(controller);

await header.init();
document.querySelector('.testMol').appendChild(header.div);