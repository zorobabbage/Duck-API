const knex = require('./knex')


function getAllDucks(currentDuck) {
    return knex('nfds').where('ID', '<=', currentDuck).select('*')
}

function sortBy(column, direction, currentDuck) {
    return knex('nfds').where('ID', '<=', currentDuck).select('*').orderBy(column, direction)
}


module.exports = {
    getAllDucks,
    sortBy
}
