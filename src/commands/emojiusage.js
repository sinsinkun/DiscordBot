const name = 'emoji usage';
const description = 'Tallies top 25 emojis of all time for server or @user.';

async function emojiUsage({ message, args, discordData }) {
    if (message.guild.available && message.channel.type === "text" && args.length === 0) {
        const emojisUsed = await discordData.server.getEmojiUsage();
        message.channel.send(emojisUsed);
    }
    else if (message.mentions.users.size === 1) {
        const emojisUsed = await discordData.user.getEmojiUsage();
        message.channel.send(emojisUsed);
    }
    else {
        message.channel.send("Incorrect arguments for emoji usage call.");
    }   
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = emojiUsage;