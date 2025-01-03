import { useState } from 'react';
import { fetchSearched, fetchSuggestion } from './api.service';
import './App.css';
import AutoComplete from './autocomplete/autocomplete';

function App() {
  const [searched, setSearched] = useState<string | false | 'searching'>(false);

  const handleSearchCall = async(searchContent:{id?: string, text?: string}) => {
    if (searchContent.id) {
      let searchedData = await fetchSearched(searchContent.id);
      setSearched(searchedData);
    } else {
      setSearched(`We don't have direct search feature yet. So no results found for ${searchContent.text}`);
    }
  }

  return (
    <div className="App">
      <AutoComplete suggestionApiCall={fetchSuggestion} searchApiCall={handleSearchCall} throttleTime={100}/>
      <div>
        {searched && <span className="search-resulte">{searched}{searched === "searching" && "..."}</span>}
      </div>
    </div>
  );
}

export default App;
