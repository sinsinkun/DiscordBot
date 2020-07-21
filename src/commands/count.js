const name = 'count';
const description = 'Counts the number of uses for an emoji over the last 6 months.';
const emojis = require('../helpers/emojis')

async function count({ message, args, timeInEpoch }) {
    const countNum = args.length;
    if (countNum === 0) message.channel.send('Nothing to count');
    else {
        for (let i=0; i<countNum; i++) {
            message.channel.send(`Counting number of \'${args[i]}\'s used. Please wait`);
            var emoCount = await emojis.countEmoteUses(message, args[i], timeInEpoch);
            message.channel.send('Number of instances of ' + args[i] + ': ' + emoCount);
        }
    }
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = count;