const fs = require("fs");
const {BigNumber, utils} = require('ethers');

const drcMerkle = JSON.parse(fs.readFileSync('data/merkle_data.json', { encoding: 'utf8' }));
let sum = BigNumber.from(0);
Object.values(drcMerkle.claims).forEach(claim => {
  sum = sum.add(claim.amount);
})
console.log('DRC to distribute for DRC airdrop:', sum.div(BigNumber.from(10).pow(18)).toNumber())

const drc_hodler = JSON.parse(fs.readFileSync('scripts/drc_hodler.json', { encoding: 'utf8' }));
const drc_lp = JSON.parse(fs.readFileSync('scripts/drc_lp.json', { encoding: 'utf8' }));
const drc_user = JSON.parse(fs.readFileSync('scripts/drc_user.json', { encoding: 'utf8' }));
const lp_on_contract_holders = JSON.parse(fs.readFileSync('scripts/lp_on_contract_holders.json', { encoding: 'utf8' }));
const addresses = JSON.parse(fs.readFileSync('data/address-list.json', { encoding: 'utf8' }));

console.log('claims total', Object.values(drcMerkle.claims).length)
console.log('drc_hodler', drc_hodler.length)
console.log('drc_lp', drc_lp.length)
console.log('drc_user', drc_user.length)
console.log('lp_on_contract_holders', lp_on_contract_holders.length)
console.log('addresses', addresses.length)


const uniMerkle = JSON.parse(fs.readFileSync('data/uni_merkle_data.json', { encoding: 'utf8' }));
let amount = utils.parseUnits("100");
const incorrectAmounts = []
Object.values(uniMerkle.claims).forEach(claim => {
  const amountIsCorrect = amount.eq(claim.amount);

  if (!amountIsCorrect) {
    incorrectAmounts.push(claim)
  }
})

console.log('all claims length', Object.values(uniMerkle.claims).length)
console.log('incorrect claims length', incorrectAmounts.length)
console.log(incorrectAmounts)