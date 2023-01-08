set -e

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)
CC_SRC_LANGUAGE=${1:-"javascript"}
CC_SRC_LANGUAGE=`echo "$CC_SRC_LANGUAGE" | tr [:upper:] [:lower:]`

CC_SRC_PATH="../chaincode-ugc-javascript"

echo ${CC_SRC_LANGUAGE}  ${CC_SRC_PATH}

# clean old identites in the wallets
rm -rf app_2/wallet/*

# launch network
pushd ../test-network
./network.sh down
./network.sh up createChannel -ca -c mychannel -s couchdb
# cd addOrg3
# ./addOrg3.sh up -ca -c channel1
# cd ..
./network.sh deployCC -c mychannel -ccn ugc -ccv 1 -cci Init -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd

cd app_2/
node app.js
