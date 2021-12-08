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
currentID = 3960
async function getMinted () {
    mintedDucks = allDucks.filter(x => x.id <= currentID)
}

loadDucksOnStart()

var cors = require('cors')

app.use(cors());

app.get('/duck/:id', async (req, res) => {
    const id = req.params.id
    console.log(typeof id)
    if (!Number.isNaN(id)) {
        if (parseInt(id) <= currentID && parseInt(id) > 0) {
            res.status(200).send(mintedDucks.filter(x => x.id == id)[0].data)
        } else {
            res.status(404).send('Duck does not exist')
        }
    } else {
        res.status(404)
    }
})


app.get('/ducks', async (req, res) => {
    const { "from": from, "to": to, "sortBy": sortBy, "order": order } = req.query
    let dbresults
    if (sortBy) {
        dbresults = await db.sortBy(sortBy, order)
    } else {
        dbresults = await db.getAllDucks()
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

app.listen(4000, () => {
    console.log('running api')
})