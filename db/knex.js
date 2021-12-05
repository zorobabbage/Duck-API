const knex = require('knex')

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "ducks.sqlite3"
    }
})

module.exports = connectedKnex
