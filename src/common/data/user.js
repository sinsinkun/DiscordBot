const db = require('../clients/dynamodb');
const emojis = require('../../helpers/emojis');
const { occurrences } = require('../../helpers/external');
const region = process.env.AWS_DEFAULT_REGION;
const tableName = process.env.TABLE_NAME;

class DiscordUser {
    constructor(userid, username, guild) {
        this._id = userid;
        this._name = username;
        this._guild = guild;
        this._db = new db({ tableName: tableName, region })
    }

    async create() {
        await this._db.create({
            id: this._id,
            username: this._name,
            server: this._guild,
            emojiUsage: {},
        })
    }

    async confirmExistence() {
        return this._db.getById(this._id);
    }

    async logEmojiUsage(message) {
        const serverEmojis = emojis.getCustomEmojis(message);
        serverEmojis.forEach(async emoji => {
			const count = occurrences(message.content, emoji.name, false);
			if (count >= 1){
                const updateExpression = "SET #emojiUsage.#emoji = #emojiUsage.#emoji + :increment"
                const createExpression = "SET #emojiUsage.#emoji = if_not_exists(#emojiUsage.#emoji, :increment)"
                const expressionNames = {
                    '#emojiUsage': "emojiUsage",
                    '#emoji': emoji.name,
                }
                const expressionValues = {
                    ':increment': count > 3 ? 3 : count,
                }
                const params = {
                    TableName: tableName,
                    Key: {
                        'id': this._id,
                    },
                    ExpressionAttributeNames: expressionNames,
                    ExpressionAttributeValues: expressionValues,
                }
                try {
                    await this._db.update({...params, UpdateExpression: updateExpression });   
                } catch (error) {
                    if (error.name === "ValidationException") {
                        // Update to existing emoji failed, probably doesn't exist.
                        try {
                            // Create new emoji in list with increment value.
                            await this._db.update({...params, UpdateExpression: createExpression })         
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    else throw error;
                }
			}
		})
    }
}

module.exports = DiscordUser;