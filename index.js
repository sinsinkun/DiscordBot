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
			const customEmojis = getCustomEmojis(message);
			message.channel.send(`You degenerates are using ${customEmojis.length} custom emojis!`);
			const postHistory = await getPostHistory(message);
			message.channel.send(`You degenerates have ${postHistory.length} posts since half an year ago!`);
			const emojisOrderedByUsage = tabulateEmojis(customEmojis, postHistory);
			message.channel.send(emojisOrderedByUsage);
		}
	}
});

function getCustomEmojis(message) {
	let customEmojis = message.guild.emojis.cache.map(emoji => {
		return { name: `:${emoji.name}:${emoji.id}`, value: "0"};
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

	return messages;
}

function tabulateEmojis(emojis, postHistory) {
	postHistory.forEach(message => {
		emojis.forEach(emoji => {
			if (message[1].content.includes(emoji.name)){
				emoji.value = (parseInt(emoji.value) + 1).toString();
			}
		})
	})
	emojis = emojis.sort((a,b) => b.value - a.value)
	return new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Custom server emojis ordered by most used')
					.addFields(...emojis.map(emoji => { return { name: `<${emoji.name}>`, value: emoji.value, inline:true }}));
}