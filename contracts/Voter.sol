// SPDX-License-Identifier: MIT
 
pragma solidity ^0.8.0;
 
contract Voter {
    address public owner;
    uint constant DURATION = 3 days; // 3 * 24 * 60 * 60
    uint constant REQUIRED_SUM = 0.01 ether; 
    uint constant FEE = 10; // 10%
    
    
    struct Voting {
        string title;
        mapping (address => uint) candidates;
        address[] allCandidates;
        bool started;
        uint totalAmount;
        mapping (address => address) participants;
        address[] allParticipants;
        uint endsAt;
        bool ended;
        uint maximumVotes;
        address winner;
    }
 
     Voting[] public votings;
 
 
     constructor() {
        owner = msg.sender;
    }
 
      modifier onlyOwner() {
        require(msg.sender == owner, "not at owner");
        _;
    }
 
    function getCandidates(uint index) public view returns(address[] memory) {
        return votings[index].allCandidates;
    }
 
    function addVoting(string memory _title) external onlyOwner {
        Voting storage newVoting = votings.push();
        newVoting.title = _title;
    }
 
    function addCandidates(uint index) external {
        
        Voting storage cVoting = votings[index];
        require(
            !addrExists(msg.sender, cVoting.allCandidates),
            "you're already added"
        );
        require(!cVoting.started, " voting already started!");
        cVoting.allCandidates.push(msg.sender);
    }
 
   
    function startVoting(uint index) external onlyOwner {
        Voting storage cVoting = votings[index];
        require(!cVoting.started, " voting already started!");
        cVoting.started = true;
        cVoting.endsAt = block.timestamp + DURATION;
      }
    
    // addrExists - function to check if an address exists
    function addrExists(address _addr, address[] memory _addresses) private pure returns(bool) { 
        for(uint i = 0; i< _addresses.length; i++) {
            if (_addresses[i] == _addr) {
                return true;
            }
        } 
        return false; 
    }
    
    function vote(uint index, address _for) external payable {
        require(msg.value == REQUIRED_SUM, "incorrect sum");
        Voting storage cVoting = votings[index];
        require(cVoting.started, "not started!");
        require(
            !cVoting.started || block.timestamp < cVoting.endsAt,
            "has ended"
        );
        require(
            !addrExists(msg.sender, cVoting.allParticipants),
            "you're already voted!"
        );
        cVoting.totalAmount += msg.value;
        cVoting.candidates[_for]++;
        cVoting.allParticipants.push(msg.sender);
        cVoting.participants[msg.sender] = _for;
        if (cVoting.candidates[_for] >= cVoting.maximumVotes) {
            cVoting.winner = _for;
            cVoting.maximumVotes = cVoting.candidates[_for];
        }
        
    }
 
    function stopVoting(uint index) external {
        Voting storage cVoting = votings[index];
        require(cVoting.started, "not started!");
        require(!cVoting.ended, "not ended!");
        require(
            block.timestamp >= cVoting.endsAt,
            "cant stop yet"
        );
        cVoting.ended = true;
        address payable _to = payable(cVoting.winner);
        _to.transfer(
            cVoting.totalAmount - ((cVoting.totalAmount * FEE) / 100)
        );
    }
 
}