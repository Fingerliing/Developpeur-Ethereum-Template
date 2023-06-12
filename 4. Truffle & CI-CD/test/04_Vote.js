const { assert, expect } = require("chai");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
    let votingInstance;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const proposal1 = "Proposal 1";
    const proposal2 = "Proposal 2";
    const proposal3 = "Proposal 3";

    describe("Vote", () => {
        beforeEach(async () => {
            votingInstance = await Voting.new();
            await votingInstance.addVoter(voter1, { from: owner });
            await votingInstance.addVoter(voter2, { from: owner });
            await votingInstance.startProposalsRegistering({ from: owner });
            await votingInstance.addProposal(proposal1, { from: voter1 });
            await votingInstance.addProposal(proposal2, { from: voter2 });
            await votingInstance.endProposalsRegistering({ from: owner });
            await votingInstance.startVotingSession({ from: owner });
        });
    
        it("should allow a registered voter to cast a vote", async () => {
            const receipt = await votingInstance.setVote(0, { from: voter1 });
            expectEvent(receipt, "Voted", { voter: voter1, proposalId: "0" });
        });
    
        it("should increase vote count for the chosen proposal", async () => {
            await votingInstance.setVote(1, { from: voter1 });
            const proposal = await votingInstance.getOneProposal(1, { from: voter1 });
            expect(proposal.voteCount.toString()).to.equal("1");
        });
    
        it("should revert when a non-registered voter tries to vote", async () => {
            await expectRevert(
                votingInstance.setVote(2, { from: voter3 }),
                "You're not a voter"
            );
        });
    
        it("should revert when a voter tries to vote more than once", async () => {
            await votingInstance.setVote(0, { from: voter1 });
            await expectRevert(
                votingInstance.setVote(1, { from: voter1 }),
                "You have already voted"
            );
        });
    
        it("should revert when a voter tries to vote for a non-existing proposal", async () => {
            await expectRevert(
                votingInstance.setVote(3, { from: voter1 }),
                "Proposal not found"
            );
        });
    });

    describe("Manage WorkflowStatus", () => {
        it("WorflowStatus should be on 'VotingSessionStarted' ", async () => {
            const status = await votingInstance.workflowStatus.call({ from: owner });
            expect(status.toNumber()).to.equal(3); // 3 étant l'ID correspondant à WorkflowStatus --> VotingSessionStarted
        });
    
        it("Change WorkflowStatus to 'VotingSessionEnded'", async () => {
            await votingInstance.endVotingSession({ from: owner });
            const status = await votingInstance.workflowStatus.call({ from: owner });
            assert.equal(status, 4, "the status should be 'VotingSessionEnded'"); // 4 étant l'ID correspondant à WorkflowStatus --> VotingSessionEnded
        });
    });
});