export class BoxTitle{
    #elem;

    constructor(text, size){
        const elem = document.createElement(getTag(size))
        elem.innerText = text;
        this.#elem = elem;
    }

    get elem(){
        return this.#elem;
    }
}

const getTag = (size) => {
    if(size === 'large'){
        return 'h2'
    }else if(size === 'medium'){
        return 'h3'
    }else{
        throw Error("unsupported element");
    }
}