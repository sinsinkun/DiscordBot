const { getPostHistory } = require('../helpers/posts')
const emojis = require('../helpers/emojis')

async function execute({ message, timeInEpoch }) {
    if (message.guild.available && message.channel.type === "text") {
        const customEmojis = emojis.getCustomEmojis(message);
        message.channel.send(`You degenerates are using ${customEmojis.length} custom emojis!`);
        const postHistory = await getPostHistory(message, timeInEpoch);
        message.channel.send(`You degenerates have ${postHistory.length} posts since half an year ago!`);
        const emojisOrderedByUsage = emojis.tabulateEmojis(customEmojis, postHistory);
        message.channel.send(emojisOrderedByUsage);
    }
}

module.exports = { emojiusage: { execute } };