// SPDX-License-Identifier: GPL-3.0

pragma solidity =0.8.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";

contract voting is Ownable{

    // Structs
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    // Enums
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }


    // Variables
    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    WorkflowStatus public workflowStatus;

    // Modifier
    modifier onlyRegisteredVoter() {
        require(voters[msg.sender].isRegistered, "Only registered voters can perform this action");
        _;
    }

    modifier onlyDuringVotingSession() {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStarted,
            "This action can only be performed during the voting session"
        );
        _;
    }

    // Events
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    // Functions

    constructor() {
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    function registerVoter(address _voterAddress) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "You have to be on Registering Voters Status");
        require(!voters[_voterAddress].isRegistered, "Voter has been already registered");

        voters[_voterAddress].isRegistered = true;
        emit VoterRegistered(_voterAddress);
    }

    function startProposalsRegistration() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Proposals registration cannot be started");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    function registerProposal(string memory _description) external onlyRegisteredVoter {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "You have to be on Proposal Registration Status");

        Proposal memory newProposal = Proposal({
            description: _description,
            voteCount: 0
        });
        proposals.push(newProposal);

        emit ProposalRegistered(proposals.length - 1);
    }
    
    function endProposalsRegistration() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registration cannot be ended");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "You have to be on Registering Ended Status");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function vote(uint _proposalId) external onlyRegisteredVoter onlyDuringVotingSession {
        require(!voters[msg.sender].hasVoted, "Voter has already voted");
        require(_proposalId < proposals.length, "Invalid proposal ID");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Start the voting session before end it");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "You have to be on Voting Session Ended Status");
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    function countVotes() external view onlyOwner returns (uint winningProposalId) {
    require(workflowStatus == WorkflowStatus.VotesTallied, "Votes cannot be counted at this stage");
    uint maxVoteCount = 0;

    for (uint i = 0; i < proposals.length; i++) {
        uint voteCount = proposals[i].voteCount;
        if (voteCount > maxVoteCount) {
            maxVoteCount = voteCount;
            winningProposalId = i;
        }
    }

    return winningProposalId;
    }


// Cette fonction permet juste d'ajouter les prérequis par rapport à la structure "proposals" qui retourne la même chose.
    function getWinningProposalDetails(uint _winningProposalId) external view returns (string memory description, uint voteCount) {
    require(workflowStatus == WorkflowStatus.VotesTallied, "Votes have not been tallied yet");
    require(_winningProposalId < proposals.length, "Invalid winning proposal ID");

    Proposal storage winningProposal = proposals[_winningProposalId];

    return (winningProposal.description, winningProposal.voteCount);
    }

}