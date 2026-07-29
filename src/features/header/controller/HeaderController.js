export class HeaderController {
    #uiState;
    #gameState;
    #state = {
        ui: {
            hudElements: [],
            navbarElements: [],
        },
        model: {
            activeScreen: "board",
            money: 0,
        },
    };
    #listeners = new Set();

    constructor(uiState, gameState) {
        this.#uiState = uiState;
        this.#gameState = gameState;
    }

    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }

    #emit() {
        for (const listener of this.#listeners) listener();
    }

    getSnapshot() {
        return this.#state;
    }

    async init() {
        const [uiSnapshot, gameSnapshot] = await Promise.all([
            this.#uiState.getSnapshot(),
            this.#gameState.getSnapshot(),
        ]);

        this.#state = {
            ui: {
                ...this.#state.ui,
                ...uiSnapshot,
            },
            model: {
                ...this.#state.model,
                ...gameSnapshot,
            },
        };

        this.#emit();
    }

    getHudElements() {
        return this.#state.ui.hudElements;
    }

    getHudValue(id) {
        console.log(this.#state.model)
        return this.#state.model[id] ?? 0;
    }

    getNavbarElements() {
        return this.#state.ui.navbarElements;
    }

    isNavbarActive(id) {
        return this.#state.model.activeScreen === id;
    }

    async changeScreen(id) {
        this.#state = {
            ...this.#state,
            ui: {
                ...this.#state.ui,
            },
        };

        await this.#gameState.setActiveScreen(id);
        const gameSnapshot = await this.#gameState.getSnapshot();
        console.log(gameSnapshot);
        this.#state = {
            ...this.#state,
            ui: {
                ...this.#state.ui,
            },
            model: {
                ...this.#state.model,
                ...gameSnapshot,
            },
        };
        this.#emit();
    }
}