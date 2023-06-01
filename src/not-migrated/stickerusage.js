const name = 'sticker usage';
const description = 'Tallies top 25 stickers of all time for server or @user.';
const DiscordUser = require('../common/data/user')
const acceptedArgs = Object.freeze({
    DESCENDING: false,
    ASCENDING: true,
});

async function stickerUsage({ message, args, discordData }) {
    if (!message.guild.available || !message.channel.type === "text") {
        // This is an error.
        return;
    }
    try {
        const arg = getArgument(args);
        if (message.mentions.users.size === 0) {
            const stickersUsed = await discordData.server.writeStickerUsage(arg);
            message.channel.send({ embeds : [stickersUsed] });
        }
        else if (message.mentions.users.size === 1) { // @user in message
            const {id, username} = message.mentions.users.first();
            const user = new DiscordUser(id, username, message.guild.name, message.guild.id); // create new instance of user
            const stickersUsed = await user.writeStickerUsage(arg);
            message.channel.send({ embeds : [stickersUsed] });
        } 
    } catch (error) {
        message.channel.send(error.message);
    } 
}

// Argument is in position 0 (for now).
// Ex: !stickerUsage ascending @user
function getArgument(args) {
    if (!args.length) return;
    if (args.length > 2) throw new Error(`Incorrect number of arguments. Accepted arguments are ${Object.keys(acceptedArgs)} followed by optional @user.`);
    return acceptedArgs[args[0].toUpperCase()];
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = stickerUsage;