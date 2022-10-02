const { Zilliqa } = require('@zilliqa-js/zilliqa')
const { MessageType } = require('@zilliqa-js/subscriptions')

// mainnet or testnet
const network = process.env.network

const nfd_contract = {
    mainnet: process.env.mainnet_contract,
    testnet: process.env.testnet_contract 
}[network]

const zil_api = {
    mainnet: 'https://api.zilliqa.com',
    testnet: 'https://dev-api.zilliqa.com'
}[network]

const zil_ws = {
    mainnet: 'wss://api-ws.zilliqa.com',
    testnet: 'wss://dev-ws.zilliqa.com'
}[network]



const zilliqa = new Zilliqa(zil_api)

global.holders = []

async function mainGetBlock() {
    console.log(nfd_contract, zil_api, zil_ws)
    getTokenHolders()
    const subscriber = zilliqa.subscriptionBuilder.buildNewBlockSubscriptions(
        zil_ws,
    )
        
    subscriber.emitter.on(MessageType.NEW_BLOCK, () => {
        getTokenHolders()
    })
    
    await subscriber.start()
}

async function getTokenHolders () {
    try {
        const result = (await zilliqa.blockchain.getSmartContractSubState(
            nfd_contract,
            "token_owners"
        )).result.token_owners
    
        const arrayResult = Object.entries(result).map(x => ({ id: x[0], address: x[1] }))
        holders = arrayResult
    } catch (err) {

    }
}

module.exports = {
    mainGetBlock
}

