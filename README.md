# @/Dracula-Protocol/dracula-airdrop


# Local Development

The following assumes the use of `node@>=10` and `python>=3`.

## Environment

Copy `.env.example` to `.env` and update variables

## Install Dependencies

`npm install`

## Compile Contracts

`npm run build`

## Run Tests

`npm run test`

## Get user data

```
./scripts/get_data.sh <INFURA_PROJECT_ID>
npm run generate-lp-address-list -- --amount <airdrop amount>
npm run generate-user-address-list -- --amount <airdrop amount>
```

## Build Merkle

```
npm run generate-merkle-root -- --input data/drc_users.json --output data/merkle_users.json
npm run generate-merkle-root -- --input data/drc_lp_holders.json --output data/merkle_lp.json
```

## Verify Merkle

```
npm run verify-merkle-root -- --input data/merkle_users.json
npm run verify-merkle-root -- --input data/merkle_lp.json
```

## Deploy

Mainnet
```
npm run deploy
```

Ganache
```
npm run deploy:ganache
```

Ganache (manual instance of ganache)
```
npm run deploy:ganachelocal
```
