type SuggestionsList = {
    suggestion: string,
    uuid: string
}[]

/**
 * Represents the autocomplete minimum needs and it's customisations
 */
type AutocompleteProps = {
    /**
     * Mandatory param to make the Suggestions API calls
     * Maintains Dependency Injection to make sure AutoComplete is a standalone component in terms of usage, test and re-usability
     * @param search : string on which suggestions will be fetched
     * @returns : a list of Promise having list of suggested strings
     */
    suggestionApiCall: (search:string) => Promise<SuggestionsList>,
    /**
     * Mandatory param to the Search API call
     * Maintains Dependency Injection to make sure AutoComplete is a standalone component in terms of usage, test and re-usability
     * @param search : string on which actual search will happen
     * @returns : void
     */
    searchApiCall: (searchId:string) => Promise<string>,
    /**
     * Set how many suggestions to show
     * By default it uses 5
     */
    suggestionsLimit?: number,
    /**
     * Set how many recent searches to remember
     * By default it uses 10
     */
    userLastSearchMemoryLimit?: number,
    /**
     * Set how much time the throttle function should wait before next api call
     * By default it uses 300 ms
     */
    throttleTime?: number,
    /**
     * Object to provide styles from parent level
     */
    style?: object
}

export type {
    AutocompleteProps,
    SuggestionsList
}