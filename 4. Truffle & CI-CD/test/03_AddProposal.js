const { assert, expect } = require("chai");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const proposal1 = "Proposal 1";

  beforeEach(async () => {
    votingInstance = await Voting.new();
    await votingInstance.addVoter(voter1, { from: owner });
    await votingInstance.startProposalsRegistering({ from: owner });
  });

  describe("add a proposal", () => {    
    it("should revert for empty proposal", async () => {
        await expectRevert(
            votingInstance.addProposal("", { from: voter2 }),
            "You must propose something"
        );
    });

    it("should revert when owner tries to add a proposal", async () => {
        await expectRevert(
          votingInstance.addProposal(proposal1, { from: owner }),
          "Owner cannot make a proposal"
        );
    });

    it("should add a proposal", async () => {
        const receipt = await votingInstance.addProposal(proposal1, { from: voter1 });
        expectEvent(receipt, "ProposalRegistered", { proposalId: "1" });
      });

    it("should get a proposal", async () => {
    await votingInstance.addProposal(proposal1, { from: voter1 });

    const proposal = await votingInstance.getOneProposal(1, { from: voter1 });
    assert.equal(proposal.description, proposal1, "Proposal description should match");
    assert.equal(proposal.voteCount, 0, "Vote count should be zero");
    });
  });  

  describe("Manage WorkflowStatus", () => {
    it("WorflowStatus should be on 'ProposasRegistrationStarted' ", async () => {
        const status = await votingInstance.workflowStatus.call({ from: owner });
        expect(status.toNumber()).to.equal(1); // 1 étant l'ID correspondant à WorkflowStatus --> ProposasRegistrationStarted
    });

    it("Change WorkflowStatus to 'ProposalRegistrationEnded'", async () => {
        await votingInstance.endProposalsRegistering({ from: owner });
        const status = await votingInstance.workflowStatus.call({ from: owner });
        assert.equal(status, 2, "the status should be 'ProposalRegistrationEnded'"); // 2 étant l'ID correspondant à WorkflowStatus --> ProposalsRegistrationEnded
    });
  });
});