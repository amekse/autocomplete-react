import React, { useEffect, useState } from "react";
import { AutocompleteProps } from "./common.types";
import { debounce, throttle } from "./service/utility.service";
import { addRecentSearchToLocalStorage, getRecentSearchesFromLocalStorage } from "./service/memory.service";
import "./autocomplete.styles.css";
import SuggestionModel from "./model/suggestions.model";
import { searchOnKeyUp } from "./common.constants";
import currentCachedModel from "./model/currentCached.model";

function AutoComplete(props:AutocompleteProps) {
    const { suggestionApiCall, searchApiCall, suggestionsLimit = 5, userLastSearchMemoryLimit = 10, throttleTime = 300, style } = props;
    const [suggestions, setSuggestions] = useState<SuggestionModel>(getRecentSearchesFromLocalStorage(suggestionsLimit));
    const [searchText, setSearchText] = useState<string>('');
    const [searched, setSearched] = useState<string | false>(false);
    const [searchFocused, setSearchFocused] = useState<boolean>(false);

    let triggerSearchDebounce = debounce(async (...args) => {
        let showSearchedData = await submitSearch(args[0]);
        setSearched(showSearchedData);
    }, 1000);

    let triggerSuggestThrottle = throttle(async (...args) => {
        let newSuggestions = await suggestionApiCall(args[0]);
        let newSuggestionModel = new SuggestionModel(newSuggestions, suggestionsLimit);
        currentCachedModel.set(args[0], newSuggestionModel);
        setSuggestions(_ => newSuggestionModel);
    }, throttleTime)

    const fetchWebSuggestions = (searchText:string) => {
        triggerSuggestThrottle(searchText);
    }

    const fetchRecentSearchesAsSuggestion = () => {
        setSuggestions(_ => getRecentSearchesFromLocalStorage(suggestionsLimit));
    }

    const submitSearch = async (searchId: string):Promise<string> => {
        addRecentSearchToLocalStorage(
            {
                suggestion: searchText,
                uuid: searchId
            },
            userLastSearchMemoryLimit
        );
        return searchApiCall(searchId);
    }

    const handleSearchInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setSearchText(value);
        value = value.trim();
        if (value === "") {
            fetchRecentSearchesAsSuggestion();
        } else {
            let presentData = currentCachedModel.get(value);
            if (presentData) {
                setSuggestions(_ => presentData as SuggestionModel);
            } else {
                fetchWebSuggestions(event.target.value);
            }
        }
    }

    const handleSearchBoxEnterPressed = (event:React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === searchOnKeyUp) {
            setSearched(`Please select a user from suggestions.`)
        }
    }

    const handleSuggestSelected = (searchId:string) => {
        if (suggestions.checkId(searchId)) {
            triggerSearchDebounce(searchId);
        }
        setSearchFocused(false);
    }

    const handleSearchFocusToggle = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const clickedElement = event.target as HTMLInputElement;
        if (clickedElement.getAttribute('data-id') === 'search-input') {
            if (searchText.trim() === "") {
                fetchRecentSearchesAsSuggestion();
            }
            !searchFocused && setSearchFocused(true);
        }
    }

    return (
        <div className="autocomplete" style={style} onClick={handleSearchFocusToggle}>
            <input data-id="search-input" type="text" value={searchText} onChange={handleSearchInputChange} onKeyUp={handleSearchBoxEnterPressed} />
            {
                searchFocused && (
                    <div>
                        {
                            suggestions.get().map(sugObj => <span key={sugObj.uuid} id={sugObj.uuid} onClick={_ => handleSuggestSelected(sugObj.uuid)}>{sugObj.suggestion}</span>)
                        }
                    </div>
                )
            }
            {searched ? <span>{searched}</span> : null}
        </div>
    )
}

export default AutoComplete;