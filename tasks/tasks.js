const { types } = require('hardhat/config');
const { getVoterContract } = require('./utils');




task('addVoting', 'Adding a new vote')
    .addParam('title', 'Contract title', undefined, types.string)
    .addParam('contract', 'Contract address', undefined, types.address)

.setAction(async(taskArgs, hre) => {

    const { contract, title } = taskArgs;
    const [owner] = await hre.ethers.getSigners();
    const vote = await getVoterContract(hre, contract);

    const tx = await vote.connect(owner).addVoting(title);
    console.log("Added new vote with the title: ", title);

});

task('addCand', 'Adding a new candidate')
    .addParam('contract', 'Contract address', undefined, types.address)
    .addParam('index', 'Contract index', undefined, types.int)
    .setAction(async(taskArgs, hre) => {
        const { contract, index } = taskArgs;
        const vote = await getVoterContract(hre, contract);
        const tx = await vote.addCandidates(`${taskArgs.index}`);
        console.log("Added new voting candidate");

    })

task('candidates', 'Get the list of candidates')
    .addParam('contract', 'Contract address', undefined, types.address)
    .addParam('index', 'Contract index', undefined, types.int)
    .setAction(async(taskArgs, hre) => {
        const { contract, index } = taskArgs;
        const vote = await getVoterContract(hre, contract);
        const tx = await vote.getCandidates(index);

        console.log(tx);
    });

task('startVoting', 'start Voting')
    .addParam('contract', 'Contract address', undefined, types.address)
    .addParam('index', 'Contract index', undefined, types.int)
    .setAction(async(taskArgs, hre) => {
        const { contract, index } = taskArgs;
        const [owner] = await hre.ethers.getSigners();
        const vote = await getVoterContract(hre, contract);

        const tx = await vote.connect(owner).startVoting(index);
        console.log("Voting start");


    })

task('stopVoting', 'stop Voting')
    .addParam('contract', 'Contract address', undefined, types.address)
    .addParam('index', 'Contract index', undefined, types.int)
    .setAction(async(taskArgs, hre) => {
        const { contract, index } = taskArgs;
        // const [owner] = await hre.ethers.getSigners();
        const vote = await getVoterContract(hre, contract);

        const tx = await vote.stopVoting(index);
        console.log("Voting stop");
    })

task('vote', 'vote for a candidate')
    .addParam('contract', 'Contract address', undefined, types.address)
    .addParam('index', 'Contract index', undefined, types.int)
    .addParam('address', 'Candidate address', undefined, types.address)
    .setAction(async(taskArgs, hre) => {
        const { contract, index, address, value } = taskArgs;
        const Voter = await getVoterContract(hre, contract);


        await Voter.vote(index, address, { value: ethers.utils.parseEther("0.01") });
        console.log("You voted for the candidate with address:", address);
    })