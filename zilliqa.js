const { Zilliqa } = require('@zilliqa-js/zilliqa')
const { MessageType } = require('@zilliqa-js/subscriptions')
const zilliqa = new Zilliqa('https://api.zilliqa.com')

const nfd_contract = process.env.NFD_CONTRACT || '0x06f70655d4aa5819e711563eb2383655449f24e9'
global.holders = []

async function mainGetBlock() {
    getTokenHolders()
    const subscriber = zilliqa.subscriptionBuilder.buildNewBlockSubscriptions(
      'wss://api-ws.zilliqa.com',
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
        if (arrayResult.length > 4000) holders = arrayResult
    } catch (err) {

    }
}

module.exports = {
    mainGetBlock
}

