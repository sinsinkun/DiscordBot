const name = 'emoji usage';
const description = 'Tallies top 25 emojis of all time for server or @user.';
const DiscordUser = require('../common/data/user')
const acceptedArgs = Object.freeze({
    DESCENDING: false,
    ASCENDING: true,
});

async function emojiUsage({ message, args, discordData }) {
    if (!message.guild.available || !message.channel.type === "text") {
        // This is an error.
        return;
    }
    try {
        const arg = getArgument(args);
        if (message.mentions.users.size === 0) {
            const emojisUsed = await discordData.server.getEmojiUsage(getArgument(args, 0));
            message.channel.send(emojisUsed);
        }
        else if (message.mentions.users.size === 1) {
            const {id, username} = message.mentions.users.first();
            const user = new DiscordUser(id, username, message.guild.name, message.guild.id);
            const emojisUsed = await user.getEmojiUsage(getArgument(args, 1));
            message.channel.send(emojisUsed);
        } 
    } catch (error) {
        message.channel.send(error.message);
    } 
}

// Argument is in position 0 (for now).
// Ex: !emojiUsage ascending @user
function getArgument(args) {
    if (!args.length) return;
    if (args.length > 2) throw new Error(`Incorrect number of arguments. Accepted arguments are ${Object.keys(acceptedArgs)} followed by optional @user.`);
    return acceptedArgs[args[0].toUpperCase()];
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = emojiUsage;