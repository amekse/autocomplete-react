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
    const [searchText, setSearchText] = useState<string>('');
    const [searched, setSearched] = useState<string | false | 'searching'>(false);
    const [searchFocused, setSearchFocused] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<SuggestionModel>(getRecentSearchesFromLocalStorage(suggestionsLimit));

    let triggerSearchDebounce = debounce(async (...args) => {
        let showSearchedData = await submitSearch(args[0]);
        setSearched(showSearchedData);
    }, 1000);

    const populateSuggestions = async(searchText:string) => {
        let newSuggestions = await suggestionApiCall(searchText);
        let newSuggestionModel = new SuggestionModel(newSuggestions, suggestionsLimit);
        currentCachedModel.set(searchText, newSuggestionModel);
        setSuggestions(_ => newSuggestionModel);
    }

    let triggerSuggestThrottle = throttle(async (...args) => {
        populateSuggestions(searchText);
    }, throttleTime)

    const fetchWebSuggestions = (searchText:string) => {
        if (searchText.length < 3) {
            populateSuggestions(searchText);
        } else {
            triggerSuggestThrottle(searchText);
        }
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
        setSearched('searching');
    }

    const handleSearchFocusToggle = (event: MouseEvent) => {
        const clickedElement = event.target as HTMLInputElement;
        if (clickedElement.getAttribute('data-id') === 'search-input') {
            if (clickedElement.value.trim() === "") {
                fetchRecentSearchesAsSuggestion();
            }
            !searchFocused && setSearchFocused(true);
        } else {
            setSearchFocused(false);
        }
    }

    useEffect(() => {
        window.addEventListener('click', handleSearchFocusToggle);

        return () => {
            window.removeEventListener('click', handleSearchFocusToggle);
        }
    }, [])

    return (
        <div className="autocomplete" style={style}>
            <input data-id="search-input" type="text" value={searchText} onChange={handleSearchInputChange} onKeyUp={handleSearchBoxEnterPressed} className="autocomplete-input" />
            {
                searchFocused && (
                    <div className="autocomplete-suggestion">
                        {
                            suggestions.get().map(sugObj => <span key={sugObj.uuid} id={sugObj.uuid} onClick={_ => handleSuggestSelected(sugObj.uuid)} className="autocomplete-suggestion-item">{sugObj.suggestion}</span>)
                        }
                    </div>
                )
            }
            {searched && <span className="autocomplete-search-outcome">{searched}{searched === "searching" && "..."}</span>}
        </div>
    )
}

export default AutoComplete;