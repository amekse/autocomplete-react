import { SuggestionsList } from "../common.types";

class SuggestionModel {
    #defaultSuggestions:SuggestionsList = [];
    #idMemory: {[key:string]: boolean} = {};

    validateSuggestItem(sugObj:{suggestion:string, uuid:string}):boolean {
        if (sugObj.suggestion.trim() !== "" && sugObj.uuid.trim() !== "") {
            return true;
        }
        return false;
    }

    constructor(suggestions : SuggestionsList = [], suggestionsLimit: number = 5) {
        let newSuggestions:SuggestionsList = [], newIdMemory:{[key:string]: boolean} = {};
        let goToLimit = suggestionsLimit <= suggestions.length ? suggestionsLimit : suggestions.length;
        for (let i=0; i<goToLimit; i++) {
            let sugObj = {
                suggestion: suggestions[i].suggestion,
                uuid: suggestions[i].uuid
            };
            
            if (this.validateSuggestItem(sugObj)) {
                newSuggestions.push(sugObj);
                newIdMemory[sugObj.uuid] = true;
            }
        }
        this.#defaultSuggestions = newSuggestions;
        this.#idMemory = newIdMemory;
    }

    get () {
        return this.#defaultSuggestions;
    }

    checkId (id:string):boolean {
        return this.#idMemory[id] || false;
    }
}

export default SuggestionModel;