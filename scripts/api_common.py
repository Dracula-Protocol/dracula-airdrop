#!/bin/python3
from collections import defaultdict
from decimal import Decimal
import os
import requests

INFURA_KEY = os.environ.get("INFURA_KEY")

def get_rpc_response(method, params=[]):
    url = "https://mainnet.infura.io/v3/{}".format(INFURA_KEY)
    params = params or []
    data = {"jsonrpc": "2.0", "method": method, "params": params, "id": 1}
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, headers=headers, json=data)
    return response.json()

def get_paginated_data(address, from_block, to_block, topics):
    params = [{"address": address, "fromBlock": from_block, "toBlock": to_block, "topics": topics}]
    response = get_rpc_response("eth_getLogs", params)
    if 'error' in response:
        if response['error']['code'] == -32005:
            mid_block = (int(from_block, 16) + int(to_block, 16)) >> 1
            arr1 = get_paginated_data(address, from_block, hex(mid_block), topics)
            arr2 = get_paginated_data(address, hex(mid_block + 1), to_block, topics)
            return arr1 + arr2
        else:
            print(response['error'])
        return []
    return response['result']

def get_contract_logs(address, decimals=18, from_block=None, to_block=None, topics=[]):
    """Get logs of a contract"""
    from_block = from_block or "0x0"
    if to_block == 'latest':
        to_block = None
    to_block = to_block or get_rpc_response("eth_blockNumber")['result']
    logs = get_paginated_data(address, from_block, to_block, topics)
    decimals_factor = Decimal("10") ** Decimal("-{}".format(decimals))
    for log in logs:
        log["amount"] = Decimal(str(int(log["data"], 16))) * decimals_factor
        #log["amount"] = Decimal(str(int(log["data"], 16)))
        log["from"] = log["topics"][1][0:2] + log["topics"][1][26:]
        log["to"] = log["topics"][2][0:2] + log["topics"][2][26:]
    return logs

def get_balances(transfers):
    balances = defaultdict(Decimal)
    for t in transfers:
        balances[t["from"]] -= t["amount"]
        balances[t["to"]] += t["amount"]
    bottom_limit = Decimal("0.00000000001")
    balances = {k: balances[k] for k in balances if balances[k] > bottom_limit}
    return balances

def get_balances_list(transfers):
    balances = get_balances(transfers)
    balances = [{"address": a, "amount": b} for a, b in balances.items()]
    balances = sorted(balances, key=lambda b: -abs(b["amount"]))
    return balances