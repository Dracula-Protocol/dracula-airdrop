const fs = require('fs');

const DRC_ADDRESSS = '0xb78b3320493a4efaa1028130c5ba26f0b6085ef8';

async function deployDistributor(name, json_path) {
  const MerkleDistributor = await ethers.getContractFactory("MerkleDistributor");
  const merkle_json = JSON.parse(fs.readFileSync(json_path, { encoding: 'utf8' }));

  if (typeof merkle_json !== 'object') {
    throw new Error('Invalid JSON');
  }

  const distributor = await MerkleDistributor.deploy(DRC_ADDRESSS, merkle_json['merkleRoot']);
  await distributor.deployed();

  console.log(`${name} distributor deployed to: `, distributor.address);
  console.log(`${name} distributor deploy hash: `, distributor.deployTransaction.hash);
}

async function main() {
  await deployDistributor('User', 'data/merkle_users.json');
  await deployDistributor('LP', 'data/merkle_lp.json');
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});