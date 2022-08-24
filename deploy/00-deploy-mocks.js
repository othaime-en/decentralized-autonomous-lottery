const { developmentChains, networkConfig } = require("../helper-hardhat-config.js")

const BASE_FEE = ethers.utils.parseEther("0.25") // It costs 0.25 LINK to request a random number
const GAS_PRICE_LINK = 1e9 // LINK per gas. A calculated value based on the gas price of the chain

module.exports = async function ({ deployments, getNamedAccounts }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        console.log("Local network detected!!! Deploying Mock Contract...")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
        })
        log("Mocks Deployed!!!")
        log("***************************************************")
    }
}

module.exports.tags = ["all", "mocks"]
