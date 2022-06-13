async function getVoterContract(hre, contract) {
    const voter = await hre.ethers.getContractFactory('Voter');
    return await voter.attach(contract);
}

module.exports = { getVoterContract };