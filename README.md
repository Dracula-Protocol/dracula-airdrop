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
./scripts/get_data.sh <INFURA_PROJECT_ID> <to-block-hex>
npm run generate-address-list -- --amount <total airdrop amount> -b <drc-per-lp-token>
npm run generate-uni-address-list -- --amount <amount per account>
```

## Build Merkle

```
npm run generate-merkle-root -- --input data/address-list.json --output data/merkle_data.json
npm run generate-merkle-root -- --input data/uni-address-list.json --output data/uni_merkle_data.json
```

## Verify Merkle

```
npm run verify-merkle-root -- --input data/merkle_data.json
npm run verify-merkle-root -- --input data/uni_merkle_data.json
```

## Verify Amounts

```
npm run verivy-amounts
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
