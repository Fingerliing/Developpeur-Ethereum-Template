const { assert, expect } = require("chai");
const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  let votingInstance;
  const owner = accounts[0];
  const voter1 = accounts[1];

    describe("Add a voter", () => {
        beforeEach(async () => {
            votingInstance = await Voting.new();
            receipt = await votingInstance.addVoter(voter1, { from: owner });
        });

        it("Register a voter", async () => {
            expectEvent(receipt, "VoterRegistered", { voterAddress: voter1 });
        });

        it("Revert when register voter twice", async function (){
            await expectRevert(
                votingInstance.addVoter(voter1, {from: owner}),
                "Already registered"
            );
        });
        
        it("Get voter's address", async () => {
            const voter = await votingInstance.getVoter(voter1, { from: voter1 });
            expect(voter.isRegistered).to.equal(true);
        });
    });

    describe("Manage WorkflowStatus", () => {

        it("WorflowStatus should be on 'RegisteringVoters' ", async () => {
            const status = await votingInstance.workflowStatus.call({ from: owner });
            expect(status.toNumber()).to.equal(0); // 0 étant l'ID correspondant à WorkflowStatus --> RegisteringVoters
        });

        it("Change WorkflowStatus to 'ProposalRegistrationStarted'", async () => {
            await votingInstance.startProposalsRegistering({ from: owner });
            const status = await votingInstance.workflowStatus.call({ from: owner });
            assert.equal(status, 1, "the status should be 'ProposalRegistrationStarted'"); // 1 étant l'ID correspondant à WorkflowStatus --> ProposalsRegistrationStarted
        });

    });
});