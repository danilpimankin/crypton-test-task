const hre = require('hardhat')
const ethers = hre.ethers

async function main() {
    const [signers] = await ethers.getSigners()

    const Voter = await ethers.getContractFactory("Voter", signers)
    const voter = await Voter.deploy()
    await voter.deployed()
    console.log("contract's address: ", voter.address)

    console.log("Deploying contracts with the account: ", signers.address);

    const balance = await signers.getBalance();
    console.log("Account balance: ", balance.toString());

}

main()
    .then(() => process.exit(0))
    .then().catch(error => {
        console.error(error);
        process.exit(1);
    });