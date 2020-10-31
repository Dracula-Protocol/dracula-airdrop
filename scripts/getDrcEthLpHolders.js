const fs = require("fs");
const Web3 = require("web3");
const MAINNET = "https://mainnet.infura.io/v3/" + process.env.INFURA_KEY;

const httpProvider = new Web3.providers.HttpProvider(MAINNET);
const web3 = new Web3(httpProvider);

const masterVampireAbi = fs.readFileSync('../abi/MasterVampire.abi')
const masterVampireContract = new web3.eth.Contract(JSON.parse(masterVampireAbi));
masterVampireContract.setProvider(httpProvider);
masterVampireContract.options.address = "0xD12d68Fd52b54908547ebC2Cd77Ec6EbbEfd3099";

const users = JSON.parse(fs.readFileSync('drc_user.json', { encoding: 'utf8' }));

main();

async function main() {

    const uniqueUsers = getUnduplicatedUsers(users);
    const balances = [];
    
    for (let i = 0; i < uniqueUsers.length; i++) {
      const userInfo = await masterVampireContract.methods.userInfo("0", uniqueUsers[i]).call().catch(e => {console.log('error with', uniqueUsers[i])})
      
      console.log("user", uniqueUsers[i], "balance", userInfo.amount)
      if (Number(userInfo.amount) > 0) {
        balances.push({
          address: uniqueUsers[i],
          amount: Web3.utils.fromWei(userInfo.amount),
          reasons: 'lp'
        })
      }
    }
    console.log('lp holders lenght:', balances.length)
    fs.writeFileSync("lp_on_contract_holders.json", JSON.stringify(balances))
    process.exit()
}

function getUnduplicatedUsers(users) {
  const usersObject = {};
  users.forEach(user => usersObject[user.address] = null)
  return Object.keys(usersObject);
}