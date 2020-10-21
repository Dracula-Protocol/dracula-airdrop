#!/bin/sh

export INFURA_KEY=$1
# Hexidecimal block number for end of airdrop range
export TO_BLOCK="0xA86AEB"

if [ -z "$INFURA_KEY" ]
then
	echo "Error: Infura API Key not set"
	exit 1
fi

echo "INFURA Key: $INFURA_KEY"
echo "To Block: $TO_BLOCK"

python3 get_drc_users.py > drc_users.json
python3 get_drc_lp_holders.py > drc_lp_holders.json