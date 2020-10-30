const fs = require("fs");
const Web3 = require("web3");
const MAINNET = "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY;

const httpProvider = new Web3.providers.HttpProvider(MAINNET);
const web3 = new Web3(httpProvider);

const pairAbi = fs.readFileSync('../abi/IUniswapV2Pair.abi')
const pairContract = new web3.eth.Contract(JSON.parse(pairAbi));
pairContract.setProvider(httpProvider);
pairContract.options.address = "0x276e62c70e0b540262491199bc1206087f523af6";

const users = JSON.parse(fs.readFileSync('drc_user.json', { encoding: 'utf8' }));

main();

async function main() {

    const uniqueUsers = getUnduplicatedUsers(users);
    const balances = [];
    
    for (let i = 0; i < uniqueUsers.length; i++) {
      const lpBalance = await pairContract.methods.balanceOf(uniqueUsers[i]).call().catch(e => {console.log('error with', uniqueUsers[i])})
      
      console.log("user", uniqueUsers[i], "balance", lpBalance)
      if (Number(lpBalance) > 0) {
        balances.push({
          address: uniqueUsers[i],
          amount: Web3.utils.fromWei(lpBalance),
          reasons: 'lp'
        })
      }
    }
    
    fs.writeFileSync("lp_on_contract_holders.json", JSON.stringify(balances))
    process.exit()
}

function getUnduplicatedUsers(users) {
  const usersObject = {};
  users.forEach(user => usersObject[user.address] = null)
  return Object.keys(usersObject);
}