import { SuggestionsList } from "../common.types";

class RecentSearchModel {
    #defaultSearchList:SuggestionsList = []

    validateandRestructureFoundData(stringData:string):SuggestionsList {
        let foundList:SuggestionsList = []
        try {
            let sugArr = JSON.parse(stringData);
            sugArr.forEach((item:any) => {
                if (item.hasOwnProperty("suggestion") && item["suggestion"] !== "" && item.hasOwnProperty("uuid") && item["uuid"] !== "") {
                    foundList.push({
                        suggestion: item["suggestion"],
                        uuid: item["uuid"]
                    })
                }
            });
        } catch (err) {
            console.log(err, stringData);
        }
        return foundList;
    }

    constructor(foundSearchData:string|null) {
        this.#defaultSearchList = foundSearchData !== null ? this.validateandRestructureFoundData(foundSearchData) : [];
    }

    get() {
        return this.#defaultSearchList;
    }

    add(item:{suggestion:string, uuid:string}, limit:number):SuggestionsList {
        if (item.suggestion.trim() !== "" && item.uuid !== "") {
            if (this.#defaultSearchList.length >= limit) {
                this.#defaultSearchList.shift();
            }
            this.#defaultSearchList.push(item);
        }
        return this.#defaultSearchList;
    }
}

export default RecentSearchModel;