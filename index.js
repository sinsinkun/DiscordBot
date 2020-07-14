const Discord = require('discord.js');
const { prefix, token } = require('./config.json')
const client = new Discord.Client();

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
			message.channel.send(`You degenerates have ${postHistory.size} posts up to now!`)
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
	return message.channel.messages.fetch()
}