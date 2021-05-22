const { DBRequest } = require('./request')
const { DBKeyRange } = require('./keyrange')
const { InvalidStateError } = require('./error')

class DBIndex {
    constructor (schema, loop, id) {
        this._schema = schema
        this._loop = loop
        this._id = id
        this._index = schema.store[id]
    }

    get name () {
        throw new Error
    }

    get keyPath () {
        throw new Error
    }

    get multiEntry () {
        throw new Error
    }

    get unique () {
        throw new Error
    }

    get (query) {
        const request = new DBRequest
        if (this._index.deleted) {
            throw new InvalidStateError
        }
        if (!(query instanceof DBKeyRange)) {
            query = DBKeyRange.only(query)
        }
        this._loop.queue.push({ method: 'get', id: this._id, query, request })
        return request
    }

    getKey (query) {
        throw new Error
    }

    getAll (query, count = null) {
        throw new Error
    }

    getAllKeys (query, count = null) {
        throw new Error
    }

    count (query) {
        throw new Error
    }

    openCursor (query, direction = 'next') {
        throw new Error
    }

    openKeyCursor (query, direction = 'next') {
        throw new Error
    }
}

exports.DBIndex = DBIndex
