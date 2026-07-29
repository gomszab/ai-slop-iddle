import { GameStatePort } from "../ports/GameStatePort.js";

const state = {
    money: 15,
    activeScreen: 'board'
}

const testState = async () => state

export class MockGameState extends GameStatePort {
   
    #state = state;

    async getSnapshot(){
        await testState();
        this.#state = {...state};
        return this.#state;
    }

    async setActiveScreen(activeScreen) {
        state.activeScreen = activeScreen;
        this.#state = {...state, activeScreen };
    }
}