const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Voter", function() {
    let owner
    let cand1
    let cand2
    let cand3
    let cand4

    beforeEach(async function() {
        [owner, cand1, cand2, cand3, cand4] = await ethers.getSigners()

        const cVoter = await ethers.getContractFactory("Voter", owner)
        vote = await cVoter.deploy()
        await vote.deployed()
        const tx = await vote.addVoting("testVoter");
        const tx2 = await vote.addCandidates(0);
        await vote.connect(cand1).addCandidates(0);
        await vote.connect(cand2).addCandidates(0);
        await vote.connect(cand3).addCandidates(0);

    })

    it("sets owner", async function() {
        const currentOwner = await vote.owner()

        expect(currentOwner).to.eq(owner.address)
    })

    it("voting added correctly", async function() {
        const cVoter = await vote.votings(0);

        // console.log(cVoter);

        expect(cVoter.title).to.eq("testVoter");
    })


    it("candidates added correctly", async function() {
        await vote.startVoting(0);
        await vote.vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand1).vote(0, owner.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand2).vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand3).vote(0, cand2.address, { value: ethers.utils.parseEther("0.01") });
        const tx = await vote.getCandidates(0)
            // console.log(tx);
            // console.log([owner.address, cand1.address, cand2.address, cand3.address]);
            // console.log(await vote.votings(0));

        expect(tx).to.deep.eq([owner.address, cand1.address, cand2.address, cand3.address]);
    })


    it("vote test", async function() {
        await vote.startVoting(0);
        await vote.vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand1).vote(0, owner.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand2).vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand3).vote(0, cand2.address, { value: ethers.utils.parseEther("0.01") });
        const cVoter = await vote.votings(0);

        // console.log(cVoter.winner);
        expect(cVoter.winner).to.deep.eq(cand1.address);

    })

    it("you're already voted", async function() {
        await vote.startVoting(0);
        await vote.vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand1).vote(0, owner.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand2).vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });
        await vote.connect(cand2).vote(0, cand2.address, { value: ethers.utils.parseEther("0.01") });
    })

    it("start and stop voting", async function() {
        await vote.startVoting(0);
        await network.provider.send("evm_increaseTime", [259200]);
        await vote.stopVoting(0);

        // const cVoter = await vote.votings(0);
        // console.log(cVoter);

        expect(cVoter.started).to.eq(true);
        expect(cVoter.ended).to.eq(true);
    })


    it("you're already added", async function() {
        await vote.connect(cand1).addCandidates(0);
    })

    it("voting already started", async function() {
        await vote.startVoting(0);
        await vote.connect(cand4).addCandidates(0);

    })


    it("voting already started 2", async function() {
        await vote.startVoting(0);
        await vote.startVoting(0);

    })



    it("not at owner", async function() {
        await vote.connect(cand1).addVoting(0);
        await vote.startVoting(0);
        await vote.vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });

    })



    it("incorrect sum", async function() {
        await vote.vote(0, cand1.address, { value: ethers.utils.parseEther("0.001") });

    })



    it("voting not started", async function() {
        await vote.vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });

    })



    it("voting has ended", async function() {
        await vote.startVoting(0);
        await network.provider.send("evm_increaseTime", [259200]);
        await vote.stopVoting(0);
        await vote.vote(0, cand1.address, { value: ethers.utils.parseEther("0.01") });

    })



    it("voting not started 2", async function() {
        await vote.stopVoting(0);

    })



    it("voting already ended", async function() {
        await vote.startVoting(0);
        await network.provider.send("evm_increaseTime", [259200]);
        await vote.stopVoting(0);
        await vote.stopVoting(0);

    })




    it("voting cant stop yet", async function() {
        await vote.startVoting(0);
        await vote.stopVoting(0);

    })

})