const Discord = require('discord.js');
const { prefix, token } = require('./config.json')
const client = new Discord.Client();

const halfAnYearInMilliseconds = 15778476000;

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);

client.on('message', async message => {
    if (message.content == `${prefix}emojiUsage`){
		message.channel.send("WIP");
		if (message.guild.available && message.channel.type === "text") {
			let customEmojis = getCustomEmojis(message);
			message.channel.send(`You degenerates are using ${customEmojis.length} custom emojis!`);
			let postHistory = await getPostHistory(message);
			message.channel.send(`You degenerates have ${postHistory} posts since half an year ago!`)
		}
	}
});

function getCustomEmojis(message) {
	let customEmojis = message.guild.emojis.cache.map(emoji => {
		return `:${emoji.name}:${emoji.id}`;
	})
	return customEmojis;
}

async function getPostHistory(message) {
	let messageBatch;
	let messages = [];
	const timeLimit = new Date().getTime() - halfAnYearInMilliseconds;
	do {
		if (messageBatch && messageBatch.size === 100){
			let lastMessage = messageBatch.last();
			if (lastMessage.createdTimestamp < timeLimit) {
				break;
			}
			messageBatch = await message.channel.messages.fetch({limit:100, before:lastMessage.id})
			messages.push(...messageBatch)
		}
		else {
			messageBatch = await message.channel.messages.fetch({limit:100})
			messages.push(...messageBatch)
		}
	} while (messageBatch && messageBatch.size === 100)

	return messages.length;
}