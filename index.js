const express = require('express')
const axios = require('axios')
const app = express()
const path = require('path')
const fs = require('fs')

const db = require('./db/ducks')
 

const metadataDir = __dirname + '/metadata/'






let allDucks = []
async function loadDucksOnStart () {
    for (let id = 1; id <= 8192; id++) {
        const filePath = `${metadataDir}DUCK_${String(id).padStart(4, "0")}.json`

        const data = fs.readFileSync(filePath)
        const obj = JSON.parse(data)

        allDucks.push({ id: id, data: obj })
    }
}

loadDucksOnStart()



app.listen(5000, () => {
    console.log('running api')
})



app.get('nfd/:id', (req, res) => {
    const id = req.params.id
    res.sendFile(path.join(__dirname, `/metadata/DUCK_${id.padStart(4, '0')}.json`))
})


//localhost:5000/ducks?from=1&to=20&sortBy=overallRarity&order=asc
//localhost:5000/ducks?from=1&to=20

app.get('/ducks', async (req, res) => {
    const { from, to, sortBy, order } =req.query

    let dbresults

    if (sortBy) {
        dbresults = await db.sortBy(sortBy, order)
    } else {
        dbresults = await db.getAllDucks()
    }


    const ids = dbresults.map(x => x.ID)
    let sortOrder = {}
    let allDucksSorted = allDucks

    ids.forEach(function (a, i) { sortOrder[a] = i; });

    allDucksSorted.sort(function (a, b) {
        return sortOrder[a.id] - sortOrder[b.id];
    });


    res.status(200).json(allDucksSorted.slice(from-1, to))
})

