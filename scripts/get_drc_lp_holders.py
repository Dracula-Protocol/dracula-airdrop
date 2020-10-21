#!/bin/python3
from api_common import *
import simplejson as json

# From block: 0xA7DF12 (11001618) Oct-06-2020
# LPToken: https://etherscan.io/token/0x276e62c70e0b540262491199bc1206087f523

def main(): 
    contract = "0x276e62c70e0b540262491199bc1206087f523af6"
    transfer_hash = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
    transfers = get_contract_logs(contract, from_block="0xA7DF12", topics=[transfer_hash])
    balances = get_balances_list(transfers)
    print(json.dumps(balances, sort_keys=True, indent=4))

if __name__ == "__main__":
    main()