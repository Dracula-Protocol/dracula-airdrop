const fs = require('fs');
let Web3 = require("web3");

let adminKey = fs.readFileSync('admin.key').toString();
const network = JSON.parse(fs.readFileSync('network-constants.json', { encoding: 'utf8' }))

const httpProvider = new Web3.providers.HttpProvider(network.mainnet);
let web3 = new Web3(httpProvider);

const account = web3.eth.accounts.privateKeyToAccount(adminKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

const GAS_LIMIT = 4700000;
const GAS_PRICE = web3.utils.toWei('50', 'gwei');
const DRC_ADDRESSS = '0xb78b3320493a4efaa1028130c5ba26f0b6085ef8';

async function main() {
  const drcDistributor = await deployDistributor('DRC_AIRDROP', 'data/merkle_data.json');
  // const uniDistributor = await deployDistributor('UNI_AIRDROP', 'data/uni_merkle_data.json');

  const result = {
    drcDistributor: drcDistributor.options.address,
    // uniDistributor: uniDistributor.options.address,
  }
  fs.writeFileSync("drc-deploy-result.json", JSON.stringify(result))
}

async function deployDistributor(name, json_path) {
  let abi = fs.readFileSync('bin/contracts/MerkleDistributor.abi').toString();
  let bin = fs.readFileSync('bin/contracts/MerkleDistributor.bin').toString();

  const merkle_json = JSON.parse(fs.readFileSync(json_path, { encoding: 'utf8' }));

  const contractToDeploy = new web3.eth.Contract(JSON.parse(abi));
  let method = contractToDeploy.deploy({ data: "0x" + bin, arguments: [DRC_ADDRESSS, merkle_json['merkleRoot']]});
  let estimatedGas = await estimateGas(method, network.admin);
  return await method.send({
      from: network.admin,
      gas: estimatedGas,
      gasPrice: GAS_PRICE
  },transactionCallback)
  .on('confirmation', () => { })
  .then((newContractInstance) => {
      console.log('Contract Deployed: ', name, newContractInstance.options.address);
  return newContractInstance;
  })
  .catch(err => {
      throw (err)
  })
}


async function estimateGas(methodCall, from, transactionValue) {
  const options = {
    gas: GAS_LIMIT,
    from
  };
  if (transactionValue) {
    options.value = transactionValue;
  }

  return await methodCall.estimateGas(options).then(gasAmount => {
    gasAmount = parseInt(gasAmount * 1.1);
    
    console.log('gas to spend: ', gasAmount)
    if (gasAmount === GAS_LIMIT) {
      throw(new Error('run out of gas', methodCall))
    }
    return gasAmount;
  });
}

function transactionCallback (err, transactionHash) {
  console.log('transactionHash', transactionHash)
    if (err) throw err;
}


main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});