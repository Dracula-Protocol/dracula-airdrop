import { program } from 'commander'
import { BigNumber } from 'ethers';
import { utils } from 'ethers';
import fs from 'fs'
import { FormatInputPathObject } from 'path';
import { exit } from 'process';

program
  .version('0.0.0')
  .requiredOption(
    '-i, --userinput <path>',
    'input JSON file location containing DRC user export from Infura'
  )
  .requiredOption(
    '-j, --lpinput <path>',
    'input JSON file location containing DRC LP export from Infura'
  )
  .requiredOption(
    '-k, --hodlerinput <path>',
    'input JSON file location containing DRC holder export from Infura'
  )
  .requiredOption(
    '-o, --output <path>',
    'output JSON file containing array of users to airdrop tokens to'
  )
  .requiredOption(
    '-a, --amount <airdrop-amount>',
    'The total amount of token to airdrop'
  )
  .requiredOption(
    '-b, --drcperlp <drc-per-lp>',
    'Amount of DRC an LP token is worth'
  )

program.parse(process.argv)

const AMOUNT_IN_WEI = utils.parseUnits(program.amount);
const USER_AMOUNT = AMOUNT_IN_WEI.div(BigNumber.from(100).div(BigNumber.from(30)));
const HODLER_AMOUNT = AMOUNT_IN_WEI.sub(USER_AMOUNT);
const DRC_PER_LP = program.drcperlp;

console.log("Total Airdrop Amount: ", utils.formatUnits(AMOUNT_IN_WEI));
console.log("   User amount (30%): ", utils.formatUnits(USER_AMOUNT));
console.log(" Hodler amount (70%): ", utils.formatUnits(HODLER_AMOUNT));


const json_input_user = JSON.parse(fs.readFileSync(program.userinput, { encoding: 'utf8' }));
if (typeof json_input_user !== 'object') {
  throw new Error('Invalid JSON');
}

type Format = { address: string; earnings: BigNumber; drc_held: BigNumber; reasons: string[] }

let merged_data : Map<string, Format> = new Map<string, Format>();

console.log("\nProcessing users...");
const total_users = json_input_user.length;
const amt_per_user = USER_AMOUNT.div(total_users);
console.log(" Total users: ", total_users);
console.log("DRC per user: ", utils.formatUnits(amt_per_user));

for (let item of json_input_user) {
  merged_data.set(item.address, {
    address: item.address,
    earnings: amt_per_user,
    drc_held: BigNumber.from(0),
    reasons: [item.reasons]
  })
}

console.log("\nProcessing LP...");

const json_input_lp = JSON.parse(fs.readFileSync(program.lpinput, { encoding: 'utf8' }));
if (typeof json_input_lp !== 'object') {
  throw new Error('Invalid JSON');
}

console.log(" Total LPs: ", json_input_lp.length);

for (let item of json_input_lp) {
  if (merged_data.has(item.address)) {
    let o : Format = merged_data.get(item.address)!;
    o.reasons = o.reasons.concat(item.reasons);
    o.drc_held = o.drc_held.add(utils.parseUnits(item.amount.toString()).mul(DRC_PER_LP));
    merged_data.set(item.address, o);
  } else {
    merged_data.set(item.address, {
      address: item.address,
      earnings: BigNumber.from(0),
      drc_held: utils.parseUnits(item.amount.toString()),
      reasons: [item.reasons]
    });
  }
}

console.log("\nProcessing hodlers...");

const json_input_hodlers = JSON.parse(fs.readFileSync(program.hodlerinput, { encoding: 'utf8' }));
if (typeof json_input_hodlers !== 'object') {
  throw new Error('Invalid JSON');
}

console.log(" Total hodlers: ", json_input_hodlers.length);

for (let item of json_input_hodlers) {
  if (merged_data.has(item.address)) {
    let o : Format = merged_data.get(item.address)!;
    o.reasons = o.reasons.concat(item.reasons);
    o.drc_held = o.drc_held.add(utils.parseUnits(item.amount.toString()));
    merged_data.set(item.address, o);
  } else {
    merged_data.set(item.address, {
      address: item.address,
      earnings: BigNumber.from(0),
      drc_held: utils.parseUnits(item.amount.toString()),
      reasons: [item.reasons]
    });
  }
}

let total_drc_held = BigNumber.from('0');
for (let v of Array.from(merged_data.values())) {
  total_drc_held = total_drc_held.add(v.drc_held);
}

console.log("Total DRC held: ", total_drc_held);

for (let v of Array.from(merged_data.values())) {
  // DEBUG
  console.log("Address: ",v.address)
  console.log("Held: ",v.drc_held.toString())
  const share = v.drc_held.div(total_drc_held).mul(HODLER_AMOUNT);
  console.log("Share: ",share.toString())
  let o : Format = merged_data.get(v.address)!;
  o.earnings = o.earnings.add(share);
  merged_data.set(v.address, o);
}

//console.log(merged_data)

type OutputFormat = { address: string; earnings: string; reasons: string }

const json_output: OutputFormat[] = Array.from(merged_data.values()).map(
  (item: Format): OutputFormat => ({
    address: item.address,
    earnings: item.earnings.toHexString(),
    reasons: item.reasons.join(','),
  })
);

fs.writeFileSync(program.output, JSON.stringify(json_output), { encoding: 'utf8' });