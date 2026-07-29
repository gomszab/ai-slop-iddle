import { GameStatePort } from "../ports/GameStatePort.js";

const getHudItems = async () => [
            {
                id: 'money',
                text: 'Pénz',
                
            },
            {
                id: 'biomtokens',
                text: 'Biom token',
    
            },
            {
                id: 'eggs',
                text: 'Tojások',
            },
            {
                id: 'turtles',
                text: 'Teknősök'
            }, {
                id: 'rares',
                text: 'Ritkák',
            },
            {
                id: 'bioms',
                text: 'Biom'
            },
        ]

const getNavbarElements = async () => [{
    id: 'board',
    text: 'Board',
},
{
    id: 'hunt',
    text: 'Teknősvadászat',
},
{
    id: 'store',
    text: 'Store',
}]

export class MockUiState extends GameStatePort {
   
    #state;

    async getSnapshot(){
        const hudElements = await getHudItems();
        const navbarElements = await getNavbarElements();
        this.#state = {hudElements, navbarElements};
        return this.#state;
    }

}