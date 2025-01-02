import { localStorageRecentSearchListKey } from "../common.constants"
import RecentSearchModel from "../model/recentSearch.model";
import SuggestionModel from "../model/suggestions.model";

function getRecentSearchesFromLocalStorage (suggestionsLimit:number): SuggestionModel {
    let recentSearchModel = new RecentSearchModel(localStorage.getItem(localStorageRecentSearchListKey));
    return new SuggestionModel(recentSearchModel.get(), suggestionsLimit);
}

function addRecentSearchToLocalStorage(searchItem:{suggestion:string, uuid:string}, userLastSearchMemoryLimit:number) {
    let recentSearchModel = new RecentSearchModel(localStorage.getItem(localStorageRecentSearchListKey));
    localStorage.setItem(localStorageRecentSearchListKey, JSON.stringify(recentSearchModel.add(searchItem, userLastSearchMemoryLimit)));
}

export {
    getRecentSearchesFromLocalStorage,
    addRecentSearchToLocalStorage
}