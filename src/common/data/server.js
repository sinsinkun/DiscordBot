const DiscordDocument = require('./discord_documents');
const tableName = process.env.SERVER_TABLE_NAME;
const region = process.env.AWS_DEFAULT_REGION;

class DiscordServer {
    constructor(serverId, serverName) {
        this._id = serverId;
        this._name = serverName;
        this._discordDoc = new DiscordDocument(serverId, tableName, region)
    }

    async create(message) {
        await this._discordDoc.create({
            id: this._id,
            servername: this._name,
            emojiUsage: {},
            stickerUsage: {},
        }, message);
    }

    async confirmExistence() {
        return this._discordDoc.confirmExistence();
    }

    async writeEmojiUsage(ascending) {
        return this._discordDoc.writeEmojiUsage(this._name, ascending);
    }

    async writeStickerUsage(ascending) {
        return this._discordDoc.writeStickerUsage(this._name, ascending);
    }

    async logEmojiUsage(message) {
        await this._discordDoc.logEmojiUsage(message);
    }

    async logStickerUsage(message) {
        await this._discordDoc.logStickerUsage(message);
    }
}

module.exports = DiscordServer;