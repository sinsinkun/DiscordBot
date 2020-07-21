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
        this._discordDoc = new DiscordDocument({ userid, tableName, region })
    }

    async create(message) {
        await this._discordDoc.create({
            id: this._id,
            username: this._name,
            server: this._guild,
            server_id: this._guildId,
            emojiUsage: {},
        }, message)
    }

    async confirmExistence() {
        return this._discordDoc.confirmExistence();
    }

    async getEmojiUsage() {
        const emojiUsage = await this._discordDoc.getEmojiUsage();
        emojiUsage.sort((a,b) => b.value - a.value)
        return new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${this._name}'s most used emojis!`)
        .addFields(...emojiUsage.map(emoji => { return { name: `<${emoji.name}>`, value: emoji.value, inline:true }}));
    }

    async logEmojiUsage(message) {
        await this._discordDoc.logEmojiUsage(message);
    }
}

module.exports = DiscordUser;