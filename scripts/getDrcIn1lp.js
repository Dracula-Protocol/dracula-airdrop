const fs = require("fs");
const Web3 = require("web3");
const BigNumber = require('bignumber.js');
const network = JSON.parse(fs.readFileSync('../network-constants.json', { encoding: 'utf8' }))

const httpProvider = new Web3.providers.HttpProvider(network.mainnet);
let web3 = new Web3(httpProvider);

let pairAbi = fs.readFileSync('../abi/IUniswapV2Pair.abi')
let pairContract = new web3.eth.Contract(JSON.parse(pairAbi));
pairContract.setProvider(httpProvider);
pairContract.options.address = "0x276e62c70e0b540262491199bc1206087f523af6";

getDrcInLp();

async function getDrcInLp() {
    // drc is token0 in the pair
    const [drcReserve, wethReserve] = await pairContract.methods.getReserves().call().then(result => {
      return [result[0], result[1]]
    });

    const totalSupply = await pairContract.methods.totalSupply().call();
    
    const drcIn1lp = bn(drcReserve).div(bn(totalSupply))
    console.log('drcIn1lp', drcIn1lp.times(1.5).toFixed(10))
    process.exit()
}

function bn(number) {
  return new BigNumber(number)
}