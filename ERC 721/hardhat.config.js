require("@nomiclabs/hardhat-waffle");
require("dotenv").config({path: '/Users/remstondsa/Desktop/Polygon/ERC 721/.env'});
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: "0.8.4",

  networks: {
    rinkeby: {
      url: process.env.API_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};