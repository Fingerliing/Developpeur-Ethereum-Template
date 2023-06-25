import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Proposals from '../Voting/Proposals';


function ContractBtns() {
  const { state: { contract, accounts } } = useEth();
  const [voterAddress, setVoterAddress] = useState("");
  const [selectedProposal, setSelectedProposal] = useState("");
  const [winningProposal, setWinningProposal] = useState(0);

  // Registering voters inside a whitelist
  const registerVoters = async () => {
    try {
      await contract.methods.addVoter(voterAddress).send({ from: accounts[0] });
      console.log("Liste blanche des électeurs enregistrée avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la liste blanche des électeurs :", error);
    }
  };

  // Démarrer la session d'enregistrement des propositions
  const startProposalsRegistration = async () => {
    try {
      await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
      console.log("Session d'enregistrement des propositions démarrée.");
    } catch (error) {
      console.error("Erreur lors du démarrage de la session d'enregistrement des propositions :", error);
    }
  };

  // Enregistrer une proposition
  const addProposal = async () => {
    const desc = prompt("Enter the proposal description:");
    if (desc) {
      try {
        await contract.methods.addProposal(desc).send({ from: accounts[0] });
        console.log("Proposition enregistrée avec succès.");
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la proposition :", error);
      }
    }
  };

  // Mettre fin à la session d'enregistrement des propositions
  const endProposalsRegistration = async () => {
    try {
      await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
      console.log("Session d'enregistrement des propositions terminée.");
    } catch (error) {
      console.error("Erreur lors de la fin de la session d'enregistrement des propositions :", error);
    }
  };

  // Démarrer la session de vote
  const startVotingSession = async () => {
    try {
      await contract.methods.startVotingSession().send({ from: accounts[0] });
      console.log("Session de vote démarrée.");
    } catch (error) {
      console.error("Erreur lors du démarrage de la session de vote :", error);
    }
  };

  // Voter pour une proposition
  const vote = async () => {
    const proposalId = parseInt(selectedProposal);
    if (isNaN(proposalId)) {
      console.error("L'indice de proposition doit être un nombre valide.");
      return;
    }
    try {
      await contract.methods.setVote(proposalId).send({ from: accounts[0] });
      console.log("Vote enregistré avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du vote :", error);
    }
  };

  // Mettre fin à la session de vote
  const endVotingSession = async () => {
    try {
      await contract.methods.endVotingSession().send({ from: accounts[0] });
      console.log("Session de vote terminée.");
    } catch (error) {
      console.error("Erreur lors de la fin de la session de vote :", error);
    }
  };

  const tallyVotes = async () => {
    try {
      await contract.methods.tallyVotes().send({ from: accounts[0] });
      
      console.log("Votes comptabilisés avec succès. Proposition gagnante :", winningProposal);
    } catch (error) {
      console.error("Erreur lors du comptage des votes :", error);
    }
  };

  // Consulter les résultats
  const viewResults = async () => {
    try {
      const winningProposalID = await contract.methods.proposals(winningProposal).call();
      setWinningProposal(winningProposalID);
      console.log("Proposition gagnante :", winningProposalID);
    } catch (error) {
      console.error("Erreur lors de la consultation de la proposition gagnante :", error);
    }
  };

  return (
    <div className="container-buttons">
      <h2>Contrat de vote</h2>
      <button className="button" onClick={registerVoters}>Enregister un voteur</button>
      <div id="input">
        <h4>Ajouter une adresse d'un voteur :</h4>
        <input
          type="text"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
          placeholder="Enter voter address"
        />
      </div>
      <button className="button" onClick={startProposalsRegistration}>Démarrer la session d'enregistrement des propositions</button>
      <button className="button" onClick={addProposal}>Enregistrer une proposition</button>
      <div>
        <Proposals />
      </div>
      <button className="button" onClick={endProposalsRegistration}>Terminer la session d'enregistrement des propositions</button>
      <button className="button" onClick={startVotingSession}>Démarrer la session de vote</button>
      <button className="button" onClick={vote}>Voter pour une proposition</button>
      <div id="input">
        <h4>Voter pour une proposition en indiquant l'index :</h4>
        <input
          type="number"
          value={selectedProposal}
          onChange={(e) => setSelectedProposal(e.target.value)}
          placeholder="Enter proposal index"
        />
      </div>
    
      <button className="button" onClick={endVotingSession}>Terminer la session de vote</button>
      <button className="button" onClick={tallyVotes}>Comptabiliser les votes</button>
      <button className="button" onClick={viewResults}>Consulter les résultats</button>
      <p>Résultat de la proposition gagnante : {winningProposal}</p>      
    </div>
  );
}

export default ContractBtns;
