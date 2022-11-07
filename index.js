require('dotenv').config();
const express = require('express')
const app = express()
const fs = require('fs')
const db = require('./db/ducks')
const cors = require('cors')
const metadataDir = __dirname + '/metadata/'
const { MongoClient } = require("mongodb")

// -----------------------------------------

let { mainGetBlock } = require('./zilliqa')

const PORT = process.env.PORT || 4000
const MONGO_DB_URL = 'mongodb+srv://padkcrfz65jw9M3:pZZJpOKWaKdkZzJCO3WF@cluster0.xyo1k.mongodb.net/production'
// -----------------------------------------

let allDucks = []

async function loadDucksOnStart() {
    for (let id = 1; id <= 8192; id++) {
        const filePath = `${metadataDir}DUCK_${String(id).padStart(4, "0")}.json`

        const data = fs.readFileSync(filePath)
        const obj = JSON.parse(data)

        allDucks.push({ id: id, data: obj })
    }
}

async function getMinted() {
    try {
        const currentID = holders.length
        const ducksMinted = allDucks.filter(x => x.id <= currentID)
        const matchedOwners = ducksMinted.map(x => ({owner: holders.find(y => y.id == x.id).address, ...x}))
        return matchedOwners
    } catch (err) {
        next(err)
    }
}

loadDucksOnStart()
mainGetBlock()


app.use(cors())

// ==================================================
//               express api stuff V 
// ==================================================

app.get('/duck/:id', async (req, res, next) => {
    const id = req.params.id

    if (id === 'metadata.json') {
        try {
            const filePath = `metadata.json`
            const data = fs.readFileSync(filePath)
            const obj = JSON.parse(data)
            res.status(200).json(obj)
        } catch (err) {
            res.status(404).json(`{ 'error' : 'Collection metadata does not exist' }`)
        }
    }

    try {
        const mintedDucks = await getMinted()
        const duck = mintedDucks.filter(x => x.id == id)[0].data
        res.status(200).json(duck)
    } catch (err) {
        res.status(404).json(`{ 'error' : 'Duck does not exist' }`)
    }
})

app.get('/ducks', async (req, res, next) => {
    const { "from": from, 
            "to": to, 
            "sortBy": sortBy, 
            "order": order,
            "base": base,
            "beak": beak,
            "eyes": eyes,
            "hat": hat,
            "outfit": outfit,
            "background": background,
            "owner": owner
        } = req.query
    
    try {
        const mintedDucks = await getMinted()
        let dbresults

        if (sortBy) {
            dbresults = await db.sortBy(sortBy, order, holders.length)
        } else {
            dbresults = await db.getAllDucks(holders.length)
        }

        const ids = dbresults.map(x => x.ID)
        let sortOrder = {}

        ids.forEach(function (x, i) { 
            sortOrder[x] = i
        })

        const mintedDucksSorted = mintedDucks.sort((a, b) => {
            return sortOrder[a.id] - sortOrder[b.id] 
        })

        let mintedDucksSortedFiltered = mintedDucksSorted.filter(duck => {
            const currentDuckArray = duck.data.attributes.slice(0, 6).map(x => x.value)
            let filter = []
            if (base != undefined) filter.push(base)
            if (beak != undefined) filter.push(beak)
            if (eyes != undefined) filter.push(eyes)
            if (hat != undefined) filter.push(hat)
            if (outfit != undefined) filter.push(outfit)
            if (background != undefined) filter.push(background)
            return filter.every(x => currentDuckArray.includes(x))
        })

        if (owner != undefined) {
            mintedDucksSortedFiltered = mintedDucksSortedFiltered.filter(duck => {
                return duck.owner.toLowerCase() == owner.toLowerCase()
            })
        }

        let newTo = to
        if (to > mintedDucksSortedFiltered.length) newTo = mintedDucksSortedFiltered.length

        const result = {
            ducksInSearch: mintedDucksSortedFiltered.length,
            resultDucks: mintedDucksSortedFiltered.slice(from - 1, newTo)
        }

        res.status(200).json(result)
        
    } catch (err) {
        next(err)
    }  
})

app.get('/attributes', async (req, res, next) => {
    try {
        let mintedDucks = await getMinted()

        let result = {
            bases: {},
            beaks: {},
            eyes: {},
            hats: {},
            outfits: {},
            backgrounds: {}
        }

        for (let i in mintedDucks) {
            const thisDuckMetadata = mintedDucks[i].data.attributes

            const base = thisDuckMetadata.find(x => x.trait_type == 'Base')['value']
            const beak = thisDuckMetadata.find(x => x.trait_type == 'Beak')['value']
            const eyes = thisDuckMetadata.find(x => x.trait_type == 'Eyes')['value']
            const hat = thisDuckMetadata.find(x => x.trait_type == 'Hat')['value']
            const outfit = thisDuckMetadata.find(x => x.trait_type == 'Outfit')['value']
            const background = thisDuckMetadata.find(x => x.trait_type == 'Background')['value']
            
            result.bases[base] == null ? result.bases[base] = 1 : result.bases[base]++
            result.beaks[beak] == null ? result.beaks[beak] = 1 : result.beaks[beak]++
            result.eyes[eyes] == null ? result.eyes[eyes] = 1 : result.eyes[eyes]++
            result.hats[hat] == null ? result.hats[hat] = 1 : result.hats[hat]++
            result.outfits[outfit] == null ? result.outfits[outfit] = 1 : result.outfits[outfit]++
            result.backgrounds[background] == null ? result.backgrounds[background] = 1 : result.backgrounds[background]++
        }

        res.status(200).json(result)
    } catch (err) {
        next(err)
    }
})

app.get('/rewards', async (req, res, next) => {
    try {
        MongoClient.connect(MONGO_DB_URL, async (err, client) => {
            const db = client.db('production');
            const data = await db.collection('weeklyrewards').find().toArray()

            // mongo db _id looks ugly in my api :(
            try {
                let alteredData = data
                alteredData.forEach(period => {
                    delete period['_id']
                    delete period['__v']
                    period['rewards'].forEach(x => {
                        delete x['_id']
                    })
                })
                res.json(alteredData)
                client.close() // bullish on not holding connections open 
            } catch (err) {
                res.json(data)
            }
            
        })
    } catch (err) {
        next(err)
    }
})


app.use((error, req, res, next) => {
    switch (error.type) {
        case 'not-found':
            res.status(200).json({
                message: error.message
            })
    }
})

app.listen(PORT, () => {
    console.log(`running api on port ${PORT}`)
})
