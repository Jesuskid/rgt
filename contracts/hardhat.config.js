require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: process.env.AVAX_TOKEN,
  },
  networks: {
    fuji: {
      url: 'https://api.avax-test.network/ext/C/rpc',
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
