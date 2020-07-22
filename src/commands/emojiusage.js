const name = 'emojiusage';
const description = 'Tallies top 50 emojis used over the last 6 months';
const { getPostHistory } = require('../helpers/posts')
const emojis = require('../helpers/emojis')
const DiscordUser = require('../common/data/user')

async function emojiUsage({ message, timeInEpoch, args }) {
    if (message.guild.available && message.channel.type === "text" && args.length === 0) {
        const customEmojis = emojis.getCustomEmojis(message);
        message.channel.send(`You degenerates are using ${customEmojis.length} custom emojis!`);
        const postHistory = await getPostHistory(message, timeInEpoch);
        message.channel.send(`You degenerates have ${postHistory.length} posts since half an year ago!`);
        const emojisOrderedByUsage = emojis.tabulateEmojis(customEmojis, postHistory);
        message.channel.send(emojisOrderedByUsage);
    }
    else if (message.mentions.users.size === 1) {
        const {id, username} = message.mentions.users.first();
        const user = new DiscordUser(id, username, message.guild.name);
        const emojisUsed = await user.getEmojiUsage();
        message.channel.send(emojisUsed);
    }
    else {
        message.channel.send("Incorrect arguments for emoji usage call.");
    }   
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = emojiUsage;