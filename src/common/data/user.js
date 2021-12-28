const Discord = require('discord.js');
const DiscordDocument = require('./discord_documents');
const region = process.env.AWS_DEFAULT_REGION;
const tableName = process.env.TABLE_NAME;

class DiscordUser {
    constructor(userid, username, guild, guildId) {
        this._id = userid;
        this._name = username;
        this._guild = guild;
        this._guildId = guildId;
        this._discordDoc = new DiscordDocument(userid, tableName, region)
    }

    async create(message) {
        await this._discordDoc.create({
            id: this._id,
            username: this._name,
            server: this._guild,
            server_id: this._guildId,
            emojiUsage: {},
            stickerUsage: {},
        }, message)
    }

    async confirmExistence() {
        return this._discordDoc.confirmExistence();
    }

    async logEmojiUsage(message) {
        await this._discordDoc.logEmojiUsage(message);
    }

    async logStickerUsage(message) {
        await this._discordDoc.logStickerUsage(message);
    }
}

module.exports = DiscordUser;