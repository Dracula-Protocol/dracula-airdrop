#!/bin/python3
from api_common import *
import simplejson as json

TO_BLOCK = os.environ.get("TO_BLOCK")

# From block: 0xA7DF12 (11001618) Oct-06-2020
# MasterVampire: https://etherscan.io/address/0xD12d68Fd52b54908547ebC2Cd77Ec6EbbEfd3099

def main():
    contract = "0xD12d68Fd52b54908547ebC2Cd77Ec6EbbEfd3099"
    deposit_hash = "0x90890809c654f11d6e72a28fa60149770a0d11ec6c92319d6ceb2bb0a4ea1a15"
    transfers = get_contract_logs(contract, from_block="0xA7DF12", to_block=TO_BLOCK, topics=[deposit_hash])

    simple_transfers = []
    for t in transfers:
        nt = {}
        nt['address'] = t['from']
        nt['amount'] = t['amount']
        simple_transfers.append(nt)

    print(json.dumps(simple_transfers, sort_keys=True, indent=4))

if __name__ == "__main__":
    main()