const { assert, expect } = require("chai");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
    let votingInstance;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const proposal1 = "Proposal 1";
    const proposal2 = "Proposal 2";
  
    beforeEach(async () => {
      votingInstance = await Voting.new();
      await votingInstance.addVoter(voter1, { from: owner });
      await votingInstance.addVoter(voter2, { from: owner });
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.addProposal(proposal1, { from: voter1 });
      await votingInstance.addProposal(proposal2, { from: voter2 });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });
      await votingInstance.setVote(1, { from: voter1 });
      await votingInstance.setVote(1, { from: voter2 });
      await votingInstance.endVotingSession({ from: owner });
    });
  
    describe("Tally votes", () => {
      it("should set the winning proposal ID correctly", async () => {
        await votingInstance.tallyVotes({ from: owner });
  
        const winningProposalID = await votingInstance.winningProposalID.call();
        assert.equal(winningProposalID, 1, "Winning proposal ID should be 1 (proposal2)");
      });
  
      it("should revert if not called by the owner", async () => {
        await expectRevert(
          votingInstance.tallyVotes({ from: voter1 }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("Manage WorkflowStatus", () => {
        it("WorflowStatus should be on 'VotingSessionEnded' ", async () => {
            const status = await votingInstance.workflowStatus.call({ from: owner });
            expect(status.toNumber()).to.equal(4); // 4 étant l'ID correspondant à WorkflowStatus --> VotingSessionEnded
        });

        it("Change WorkflowStatus to 'VotesTallied'", async () => {
            await votingInstance.tallyVotes({ from: owner });
            const status = await votingInstance.workflowStatus.call({ from: owner });
            assert.equal(status, 5, "the status should be 'VotesTallied'"); // 5 étant l'ID correspondant à WorkflowStatus --> VotesTallied
        });
    });
  });
  