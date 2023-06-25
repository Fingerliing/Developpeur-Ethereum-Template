import React, { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Proposals() {
  const { state: { contract, accounts } } = useEth();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const getProposals = async () => {
      try {
        const count = await contract.methods.proposalsCount().call();
        const newProposals = [];

        for (let i = 0; i < count; i++) {
          const proposal = await contract.methods.proposals(i).call();
          newProposals.push(proposal);
        }

        setProposals(newProposals);
      } catch (error) {
        console.error("Erreur lors de la récupération des propositions :", error);
      }
    };

    getProposals();
  }, [contract.methods, accounts]);

  return (
    <div>
    <h3>Propositions:</h3>
    {proposals.length > 0 ? (
      <ul>
        {proposals.map((proposal) => (
          <li key={proposal.Id}>{proposal.Description}</li>
        ))}
      </ul>
    ) : (
      <p>Aucune proposition disponible</p>
    )}
  </div>
  );
}

export default Proposals;
