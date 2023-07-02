import useEth from "../../contexts/EthContext/useEth";
import ContractBtns from "./ContractBtns";
import NoticeNoArtifact from "../Voting/NoticeNoArtifact";
import NoticeWrongNetwork from "../Voting/NoticeWrongNetwork";



function Demo() {
  const { state } = useEth();
  console.log('State', state)

  const demo =
    <>
      <div className="contract-container">
        <ContractBtns />
      </div>
    </>;

  return (
    <div className="demo">
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
}

export default Demo;
