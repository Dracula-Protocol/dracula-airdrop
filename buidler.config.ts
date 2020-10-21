import { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-typechain");

const config: BuidlerConfig = {
  solc: {
    version: "0.6.12"
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5"
  }
};

export default config;