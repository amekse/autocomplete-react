import { fetchSearched, fetchSuggestion } from './api.service';
import './App.css';
import AutoComplete from './autocomplete/autocomplete';

function App() {
  return (
    <div className="App">
      <AutoComplete suggestionApiCall={fetchSuggestion} searchApiCall={fetchSearched} throttleTime={100}/>
    </div>
  );
}

export default App;
