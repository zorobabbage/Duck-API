const express = require('express')
const app = express()
const fs = require('fs')
const db = require('./db/ducks')

const metadataDir = __dirname + '/metadata/'
let allDucks = []
let mintedDucks = []
async function loadDucksOnStart () {
    for (let id = 1; id <= 8192; id++) {
        const filePath = `${metadataDir}DUCK_${String(id).padStart(4, "0")}.json`

        const data = fs.readFileSync(filePath)
        const obj = JSON.parse(data)

        mintedDucks.push({ id: id, data: obj })
    }
}

async function getMinted () {
    currentID = 3960
    mintedDucks = allDucks.filter(x => x.id <= currentID)
}



loadDucksOnStart()

// server.js or app.js
var cors = require('cors')

app.use(cors());

app.get('/duck/:id', async (req, res) => {
    const id = req.params.id
    res.status(200).send(mintedDucks.filter(x => x.id == id)[0].data)
})


app.get('/ducks', async (req, res) => {

    const { from, to, sortBy, order } = req.query

    let dbresults
    if (sortBy) {
        dbresults = await db.sortBy(sortBy, order)
        console.log(sortBy, order)
        console.log(dbresults)
    } else {
        dbresults = await db.getAllDucks()
        console.log(dbresults)
    }

    const ids = dbresults.map(x => x.ID)
    let sortOrder = {}
    let mintedDucksSorted = mintedDucks

    ids.forEach(function (a, i) { sortOrder[a] = i; });

    mintedDucksSorted.sort(function (a, b) {
        return sortOrder[a.id] - sortOrder[b.id];
    });


    res.status(200).json(mintedDucksSorted.slice(from-1, to))
})

app.listen(5000, () => {
    console.log('running api')
})