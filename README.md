# Auto-Complete Component

## Overview
This project is a standalone auto-complete component built with React and TypeScript. It mimics the functionality of Google Search, offering a seamless user experience with efficient search suggestions and a clean UI.

## Features
- Real-time Suggestions: Fetches suggestions from an API as the user types.
- Cached Suggestions: Recently fetched suggestions are cached in memory to minimize API calls.
- Search History: Stores the last 10-15 searches locally and displays them as suggestions when the search box is empty.
- Highlight Matches: Highlights matching parts of the suggestion text for better visual guidance.
- Distinct Styling for History: Suggestions from the search history are italicized for easy differentiation.
- Efficient Handling:
  - Highlights matching parts in O(n) complexity.
  - Throttles API calls for optimized performance.
  - Loads the last suggestions on focus without re-calling the API.

## Key Props
### Required Props:
- `suggestionApiCall`: To make the Suggestions API calls.
  - Params: `search` _string on which suggestions will be checked_
  - Returns: _A list of Promise having list of suggested strings_
- `searchApiCall`: To the Search API call
  - Params: `search` _string/id/state name on which search should happen_

### Optional Props:

- `throttleTime`: Set how much time the throttle function should wait before next api call.
- `userLastSearchMemoryLimit`: Set how much time the throttle function should wait before next api call.
- `suggestionsLimit`: Set how many suggestions to show.
- `style`: Object to provide custom styles from parent level.

## Architecture
The component is designed with a modular and reusable approach, adhering to clean code practices:

- Models (POJO): Used to define reusable data structures.
- Systems for Modularity: Side-effects are handled systematically to maintain a clear separation of concerns.
- Local Storage: Utilized for storing search history persistently.
- In-Memory Cache: For fast retrieval of recent suggestions.

### Usage

```
<AutoComplete suggestionApiCall={myOwnSuggestionsAPI} searchApiCall={myOwnSearchAPI} />
```
 
### Implementation Highlights
- Fetching Suggestions: API calls are throttled to optimize performance and prevent overloading the server.
- Caching:
- Memory caching avoids redundant API requests for recent suggestions.
- Local storage preserves search history between sessions.
- Highlighting Matches: An efficient algorithm ensures highlighting is performed in O(n) time complexity.
- Search Triggering:
  - Enter: Triggers searchApiCall. (Currently returns "data not found.")
  - Suggestion Click: Searches data by suggestion ID.
  - Loading State: Displayed during search.
- User-Friendly UX:
Suggestions display instantly from memory or local storage.
- Italicized history suggestions distinguish them from real-time API results.

### Demo
A short video demonstrating the component is available [here](https://drive.google.com/file/d/1SdSP2joQ0JsDs3LOws8qlfNb4ar2T8qB/view?usp=sharing).

### Future Enhancements
- Integrate advanced analytics for suggestion ranking.
- Improve accessibility with ARIA attributes.

### License
This project is licensed under the MIT License.
