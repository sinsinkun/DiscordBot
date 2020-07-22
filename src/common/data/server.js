const Discord = require('discord.js');
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
        }, message);
    }

    async confirmExistence() {
        return this._discordDoc.confirmExistence();
    }

    async getEmojiUsage(descending) {
        const emojiUsage = await this._discordDoc.getEmojiUsage();
        emojiUsage.sort((a,b) => descending ? b.value - a.value : a.value - b.value)
        return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${this._name}'s ${descending ? "most" : "least"} used emojis!`)
        .addFields(...emojiUsage.map(emoji => { return { name: `<${emoji.name}>`, value: emoji.value, inline:true }}));
    }

    async logEmojiUsage(message) {
        await this._discordDoc.logEmojiUsage(message);
    }
}

module.exports = DiscordServer;