#!/bin/python3
from api_common import *
import simplejson as json

# From block: 0xA7DF12 (11001618) Oct-06-2020
# DRC: https://etherscan.io/token/0xb78b3320493a4efaa1028130c5ba26f0b6085ef8#balances

TO_BLOCK = os.environ.get("TO_BLOCK")

ADDRESS_EXCLUDES = ['0x276e62c70e0b540262491199bc1206087f523af6', # Uniswap Pool
                     '0xa896e4bd97a733f049b23d2aceb091bce01f298d', # dev address
                     '0xd12d68fd52b54908547ebc2cd77ec6ebbefd3099' # MasterVampire
                    ] 
# User must hold at least this much to get the drop
MIN_HOLDING_AMOUNT = 1#1 * pow(10,18)

def main(): 
    contract = "0xb78B3320493a4EFaa1028130C5Ba26f0B6085Ef8"
    transfer_hash = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    transfers = get_contract_logs(contract, from_block="0xA7DF12", to_block=TO_BLOCK, topics=[transfer_hash])
    balances = get_balances_list(transfers)
    
    simple_transfers = []
    for t in balances:
        if t['address'] in ADDRESS_EXCLUDES:
            continue
        if t['amount'] < MIN_HOLDING_AMOUNT:
            continue
        nt = {}
        nt['address'] = t['address']
        nt['amount'] = t['amount']
        nt['reasons'] = 'hodler'
        simple_transfers.append(nt)

    print(json.dumps(simple_transfers, sort_keys=True, indent=4))

if __name__ == "__main__":
    main()