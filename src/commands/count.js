const emojis = require('../helpers/emojis')

async function execute({message, args, timeInEpoch}) {
    const countNum = args.length;
    if (countNum === 0) message.channel.send('Nothing to count');
    else {
        for (let i=0; i<countNum; i++) {
            var emoCount = await emojis.countEmoteUses(message, args[i], timeInEpoch);
            message.channel.send('Number of instances of ' + args[i] + ': ' + emoCount);
        }
    }
}

module.exports = { count: { execute } };