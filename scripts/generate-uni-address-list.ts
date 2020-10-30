import { program } from 'commander'
import fs from 'fs'

program
  .version('0.0.0')
  .requiredOption(
    '-i, --input <path>',
    'input JSON file location containing export from Infura'
  )
  .requiredOption(
    '-o, --output <path>',
    'output JSON file containing array of users to airdrop tokens to'
  )
  .requiredOption(
    '-a, --amount <airdrop-amount>',
    'The amount of token to airdrop'
  )
  .requiredOption(
    '-u, --usertype <user,lp>',
    'The type of user being airdropped (user, lp)'
  )

program.parse(process.argv)

const json_input = JSON.parse(fs.readFileSync(program.input, { encoding: 'utf8' }));

if (typeof json_input !== 'object') {
  throw new Error('Invalid JSON');
}

type Format = { address: string; earnings: string; reasons: string }

const json_output: Format[] = json_input.map(
  (item: string): Format => ({
    address: item,
    earnings: `0x${(program.amount).toString(16)}`,
    reasons: program.usertype,
  })
);

// Filter duplicates
const filtered_json_output = json_output.filter((account, index, self) =>
  index === self.findIndex((t) => (
    t.address === account.address
  ))
);

fs.writeFileSync(program.output, JSON.stringify(filtered_json_output), { encoding: 'utf8' });