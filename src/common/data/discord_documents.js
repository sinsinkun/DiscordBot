const db = require('../clients/dynamodb');
const emojis = require('../../helpers/emojis');
const stickers = require('../../helpers/stickers');
const { occurrences } = require('../../helpers/external');

class DiscordDocument {
    constructor(id, tableName, region) {
        this._tableName = tableName;
        this._id = id;
        this._db = new db({ tableName: tableName, region })
    }

    async create(document, message) {
        await this._db.create(document)
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

    async getStickerUsage() {
        const document = await this._db.getById(this._id);
        const array = Object.entries(document.stickerUsage).map(( [k, v] ) => ({ name: k, value: v }));
        if (!array.length) {
            throw new Error("This user hasn't used any custom stickers!");
        }
        return array;
    }

    async logEmojiUsage(message) {
        const serverEmojis = emojis.getCustomEmojis(message);
        serverEmojis.forEach(async emoji => {
            const count = occurrences(message.content, emoji, false);
            if (count >= 1){
                const updateExpression = "SET #emojiUsage.#emoji = #emojiUsage.#emoji + :increment"
                const createExpression = "SET #emojiUsage.#emoji = if_not_exists(#emojiUsage.#emoji, :increment)"
                const expressionNames = {
                    '#emojiUsage': "emojiUsage",
                    '#emoji': emoji,
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

    async logStickerUsage(message) {
        if (!message.stickers.size) return;

        const serverStickers = stickers.getCustomStickers(message);
        const sticker = message.stickers.get(message.stickers.keys().next().value); // WHY THE HELL IS THIS A MAP IF YOU CAN ONLY SEND ONE STICKER PER MESSAGE??? DISCORD PLEASE??????

        if (serverStickers.includes(`:${sticker.name}:${sticker.id}`)) {
            const updateExpression = "SET #stickerUsage.#sticker = #stickerUsage.#sticker + :increment"
            const createExpression = "SET #stickerUsage.#sticker = if_not_exists(#stickerUsage.#sticker, :increment)"
            const expressionNames = {
                '#stickerUsage': "stickerUsage",
                '#sticker': sticker.name,
            }
            const expressionValues = {
                ':increment': 1,
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
    }
}

module.exports = DiscordDocument