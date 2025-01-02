import SuggestionModel from "./suggestions.model";

class CurrentCachedModel {
    static #instance:CurrentCachedModel;
    #cacheMemory:{[key:string]:SuggestionModel} = {};

    private constructor() {}

    public static get instance():CurrentCachedModel {
        if (!CurrentCachedModel.#instance) {
            CurrentCachedModel.#instance = new CurrentCachedModel();
        }
        return CurrentCachedModel.#instance;
    }

    get(key:string):SuggestionModel | false {
        return this.#cacheMemory[key] || false;
    }

    set(key:string, value: SuggestionModel) {
        this.#cacheMemory[key] = value;
    }
}

const currentCachedModel = CurrentCachedModel.instance;
export default currentCachedModel;