const { task } = require("hardhat/config")

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
// tasks
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners()
    for (const account of accounts) {
        console.log(account.address)
    }
})

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || ""
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2 || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""

module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            chainId: 4,
            accounts: [PRIVATE_KEY, PRIVATE_KEY_2],
            blockConfirmations: 6,
        },
        goerli: {
            url: GOERLI_RPC_URL,
            chainId: 5,
            accounts: [PRIVATE_KEY, PRIVATE_KEY_2],
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
    mocha: {
        timeout: 10000000, // 200 seconds
    },
    namedAccounts: {
        deployer: {
            default: 0,
            5: 1,
        },
        player: {
            default: 1,
        },
    },
}
