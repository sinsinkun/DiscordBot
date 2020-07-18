const db = require('../clients/dynamodb');
const region = process.env.AWS_DEFAULT_REGION;

class DiscordUser {
    constructor(userid, username, guild) {
        this._id = userid;
        this._name = username;
        this._guild = guild;
        this._db = new db({ tableName: "discord_users", region })
    }

    async create() {
        await this._db.create({
            id: this._id,
            username: this._name,
            server: this._guild,
            emojiUsage: [],
        })
    }

    async confirmExistence() {
        return this._db.getById(this._id);
    }
}

module.exports = DiscordUser;