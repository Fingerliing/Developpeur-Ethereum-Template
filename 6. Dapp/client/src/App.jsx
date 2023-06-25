import { EthProvider } from "./contexts/EthContext";
import Voting from "./components/Voting";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Voting />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
