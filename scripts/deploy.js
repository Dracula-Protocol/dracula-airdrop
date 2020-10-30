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

  const proof = ["0x26344a000db802f872a878e9caaad7746d8698e7fadcd4763d10cf79ae2bb1ad",
                 "0xccf2665610ec62a35bec464da667bbd5add13408e6cb7fd8d6114338e0a1be1b",
                 "0xe2283f93d4369d980954531b9166ea12833e61b3ee9d5a21c150b2f699bc17e7",
                 "0xc43418f33069fcc1a448f0d25a4cb1b9fa21536127dae41b9d34ed135efa5856",
                 "0x17b530adb40eaebc5009900f03121e1cae6329a356b21ce05d41abd0f527919e",
                 "0xb44b23cea6bcbf24091dddef00128ba3614dbfce867a569fd17b9b950cd9a086",
                 "0xf56cff6523e132369d78215dcbd899de10d80ea43dd97edd9d54c6c0d7e898b5",
                 "0x3e59039fa0d07a24c2f771ee060767724917e99e07edb45b1afd10833447811d",
                 "0x8c619632b7ca0a9c83dbc16904fa8c3bf34d52ff1493133134e76e5f8de795a5",
                 "0xfcf7cd288c3d5db6a3b60c9305624bc2509811000e62a43c405af94dcc5cbd39"];
  //const proof = proofs.map((p) => Buffer.from(p.slice(2), 'hex'))
  //console.log(proof)
  const tx = await distributor.claim(72, '0x124e39Cd821DD9d2f9135941eAA59411b1535C79', 30, proof, []);
  console.log(tx);
}

async function main() {
  await deployDistributor('User', 'data/merkle_users.json');
  //await deployDistributor('LP', 'data/merkle_lp.json');
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});