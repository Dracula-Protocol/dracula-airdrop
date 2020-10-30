#!/bin/python3
from api_common import *
import simplejson as json

# From block: 0xA7DF12 (11001618) Oct-06-2020
# LPToken: https://etherscan.io/token/0x276e62c70e0b540262491199bc1206087f523

ADDRESS_EXCLUDES = ['0xd12d68fd52b54908547ebc2cd77ec6ebbefd3099'] # MasterVampire/Uniswap Pool

def main(): 
    contract = "0x276e62c70e0b540262491199bc1206087f523af6"
    transfer_hash = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    transfers = get_contract_logs(contract, from_block="0xA7DF12", topics=[transfer_hash])
    balances = get_balances_list(transfers)
    
    simple_transfers = []
    for t in balances:
        if t['address'] in ADDRESS_EXCLUDES:
            continue
        nt = {}
        nt['address'] = t['address']
        nt['amount'] = t['amount']
        nt['reasons'] = 'lp'
        simple_transfers.append(nt)

    print(json.dumps(simple_transfers, sort_keys=True, indent=4))

if __name__ == "__main__":
    main()