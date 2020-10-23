import * as dotenv from "dotenv";
import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";
dotenv.config({ path: __dirname + '/.env' });

usePlugin("@nomiclabs/buidler-ganache");
usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-typechain");

const INFURA_API_KEY = `${process.env.INFURA_API_KEY}`;
const RINKEBY_PRIVATE_KEY = `${process.env.RINKEBY_PRIVATE_KEY}`;
const MAINNET_PRIVATE_KEY = `${process.env.MAINNET_PRIVATE_KEY}`;

const config: BuidlerConfig = {
  solc: {
    version: "0.6.12"
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5"
  },
  networks: {
    buidlerevm: {
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [RINKEBY_PRIVATE_KEY]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [MAINNET_PRIVATE_KEY]
    }
  }
};

export default config;