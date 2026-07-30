import { GenericAtom } from "./GenericAtom.js";

export class BoxTitle extends GenericAtom{
    constructor(text, size){
        super(getTag(size),'');
        this.text = text;
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