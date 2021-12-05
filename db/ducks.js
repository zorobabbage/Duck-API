const knex = require('./knex')

function getAllDucks() {
    return knex('nfds').select('*')
}

function sortBy(column, direction) {
    console.log(column, direction)
    return knex('nfds').select('*').orderBy(column, direction)
}


module.exports = {
    getAllDucks,
    sortBy
}
