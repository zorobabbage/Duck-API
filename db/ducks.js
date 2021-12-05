const knex = require('./knex')

const currentDuck = 3960

function getAllDucks() {
    return knex('nfds').where('ID', '<=', currentDuck).select('*')
}

function sortBy(column, direction) {
    return knex('nfds').where('ID', '<=', currentDuck).select('*').orderBy(column, direction)
}


module.exports = {
    getAllDucks,
    sortBy
}
