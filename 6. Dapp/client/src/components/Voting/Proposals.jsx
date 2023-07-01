import React from "react";

function Proposals({ proposals }) {
  return (
    <div>
      <h3>Propositions:</h3>
      {proposals.length > 0 ? (
        <ul>
          {proposals.map((proposal, i) => (
            <li key={i}>{proposal.description}</li>
          ))}
        </ul>
      ) : (
        <p>Aucune proposition disponible</p>
      )}
    </div>
  );
}

export default Proposals;
