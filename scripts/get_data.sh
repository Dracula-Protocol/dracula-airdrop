#!/bin/sh

export INFURA_KEY=$1
# Hexidecimal block number for end of airdrop range
export TO_BLOCK=$2
#"0xA86AEB"

if [ -z "$INFURA_KEY" ]
then
	echo "Error: Infura API Key not set"
	exit 1
fi

if [ -z "$TO_BLOCK" ]
then
	echo "Error: To block not set"
	exit 1
fi

echo "INFURA Key: $INFURA_KEY"
echo "To Block: $TO_BLOCK"

echo "Retrieving DRC users..."
python3 get_drc_users.py > drc_user.json
echo "Retrieving LP users..."
python3 get_drc_lp_holders.py > drc_lp.json
echo "Retrieving DRC hodlers..."
python3 get_drc_holders.py > drc_hodler.json