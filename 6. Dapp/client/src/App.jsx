import { EthProvider } from "./contexts/EthContext";
import Voting from "./components/Voting";


function App() {
  return (
    <EthProvider>
      <Voting />
    </EthProvider>
  );
}

export default App;
