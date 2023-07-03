import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
import VotingArtifact from "../../contracts/Voting.json";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi } = VotingArtifact;
      let address, contract;
      try {
        address = VotingArtifact.networks[networkID].address;
        contract = new web3.eth.Contract(abi, address);
        console.log('Address', address)
        console.log('Contract', contract)
      } catch (err) {
        console.error(err);
      }
      console.log('Dispatching action:', { artifact: VotingArtifact, web3, accounts, networkID, contract });

      dispatch({
        type: actions.init,
        data: { artifact: VotingArtifact, web3, accounts, networkID, contract }
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        await init();
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init();
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init]);

  const registerVoter = async () => {
    try {
      await state.contract.methods.addVoter(state.accounts[0]).send({ from: state.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  };

  const startProposalRegistration = async () => {
    try {
      await state.contract.methods.startProposalsRegistering().send({ from: state.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  };

  const addProposal = async (description) => {
    try {
      await state.contract.methods.addProposal(description).send({ from: state.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  };

  const endProposalRegistration = async () => {
    try {
      await state.contract.methods.endProposalsRegistering().send({ from: state.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  };

  const startVotingSession = async () => {
    try {
      await state.contract.methods.startVotingSession().send({ from: state.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  };

  const vote = async (proposalId) => {
    try {
      await state.contract.methods.setVote(proposalId).send({ from: state.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  };

  const endVotingSession = async () => {
    try {
      await state.contract.methods.endVotingSession().send({ from: state.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  };

  const getResult = async () => {
    try {
      const result = await state.contract.methods.getOneProposal(state.contract.winningProposalID()).call();
      console.log("Result:", result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
        registerVoter,
        startProposalRegistration,
        addProposal,
        endProposalRegistration,
        startVotingSession,
        vote,
        endVotingSession,
        getResult
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
