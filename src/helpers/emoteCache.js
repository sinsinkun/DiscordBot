const db = require('../common/clients/dynamodb.js');
const region = process.env.AWS_DEFAULT_REGION;
const tableName = 'custom_emotes';

class EmoteCache {
    constructor () {
        this._customEmoteList = new db({ tableName: tableName, region: region})
        this._cache = null
    }

    async updateCache() {
        this._cache = await this._customEmoteList.getEmoteList()
    }

    findIndex(name) {
        return this._cache.findIndex(e => e.input === name)
    }

    async find(name) {
        if (!this._cache) await this.updateCache()

        return this._cache.find(e => e.input === name)
    }

    async remove(name) {
        if (!this._cache) await this.updateCache()

        const index = this.findIndex(name)
        if (index) {
            const removeSuccess = await this._customEmoteList.removeEmote(name)
            this._cache.splice(index, 1)
            return removeSuccess
        }
    }

    async add(name, value) {
        if (!this._cache) await this.updateCache()

        const addSuccess = await this._customEmoteList.addEmote(name, value)
        this._cache.push({output: value, input: name})
        return addSuccess
    }

    async list() {
        if (!this._cache) await this.updateCache()
        
        return this._cache
    }

    async listClone() {
        if (!this._cache) await this.updateCache()
        
        return structuredClone(this._cache)
    }
}

module.exports = new EmoteCache()