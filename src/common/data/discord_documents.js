const db = require('../clients/dynamodb');
const { getPostHistory } = require('../../helpers/posts')
const emojis = require('../../helpers/emojis');
const { occurrences } = require('../../helpers/external');

class DiscordDocument {
    constructor(id, tableName, region) {
        this._tableName = tableName;
        this._id = id;
        this._db = new db({ tableName: tableName, region })
    }

    async create(document, message) {
        await this._db.create(document)
        const history = await getPostHistory(message);
        const customEmojis = await emojis.getCustomEmojis(message);
        const emojiUsage = countEmojiUse(customEmojis, history);
        await this._discordDoc.logHistoricEmojicUsage(emojiUsage)
    }

    async confirmExistence() {
        return this._db.getById(this._id);
    }

    async getEmojiUsage() {
        const document = await this._db.getById(this._id);
        const array = Object.entries(document.emojiUsage).map(( [k, v] ) => ({ name: k, value: v }));
        if (!array.length) {
            throw new Error("This user hasn't used any custom emojis!");
        }
        return array;
    }

    async logHistoricEmojicUsage(historicEmojiUsage) {
        historicEmojiUsage.forEach(async emoji => {
            const updateExpression = "SET #emojiUsage.#emoji = #emojiUsage.#emoji + :increment"
            const createExpression = "SET #emojiUsage.#emoji = if_not_exists(#emojiUsage.#emoji, :increment)"
            const expressionNames = {
                '#emojiUsage': "emojiUsage",
                '#emoji': Object.name(emoji),
            }
            const expressionValues = {
                ':increment': emoji,
            }
            const params = {
                TableName: this._tableName,
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
        })
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
                    TableName: this._tableName,
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

function countEmojiUse(emojis, postHistory) {
	postHistory.forEach(message => {
		emojis.forEach(emoji => {
			const count = occurrences(message.content, Object.name(emoji), false);
			if (count >= 1){
				emoji += count > 3 ? 3 : count;
			}
		})
	})
	return emojis;
}

module.exports = DiscordDocument