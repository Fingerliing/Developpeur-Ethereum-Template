const { assert, expect } = require("chai");
const { expectRevert } = require("@openzeppelin/test-helpers");
const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
    let votingInstance;
    const owner = accounts[0];
  
    beforeEach(async () => {
      votingInstance = await Voting.new();
    });
    
    describe("Deploy contract", () => {
        it("should deploy the contract with the correct owner", async () => {
            const contractOwner = await votingInstance.owner();
            assert.equal(contractOwner, owner, "The contract owner is incorrect");
        });
    
        it("should have the initial workflow status as 'RegisteringVoters'", async () => {
            const status = await votingInstance.workflowStatus();
            assert.equal(status, 0, "The initial workflow status is incorrect");
        });
    });

    describe("Manage WorkflowStatus", () => {
        it("should emit the WorkflowStatusChange event when deploying", async () => {
            const receipt = await votingInstance.deployTransaction.wait();
            const events = receipt.events;
            assert.exists(events.WorkflowStatusChange, "The event WorkflowStatusChange was not emitted");
            const event = events.WorkflowStatusChange;
            assert.equal(event.event, "WorkflowStatusChange", "The event name is incorrect");
            assert.equal(event.args.previousStatus, 0, "The previous status is incorrect");
            assert.equal(event.args.newStatus, 0, "The new status is incorrect");
        });
    });
  });