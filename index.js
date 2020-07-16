const Discord = require('discord.js');
const prefix = '!';
const client = new Discord.Client();
const halfAnYearInMilliseconds = 15778476000;

client.once('ready', () => {
	console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);

client.on('message', async message => {
	//full chat log
	console.log(message.channel.name + ', ' + message.author.username + ': ' + message.content);

	//parsing commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toUpperCase();
	
	//ECHO command
	if (command == 'ECHO') {
		if (args.length < 1) message.channel.send('echo');
		else {
			let argsString = '';
			args.forEach(arg => argsString = argsString + ' ' + arg);
			message.channel.send(argsString);
		}
	}
	
	//COUNT command
	if (command == 'COUNT') {
		const countNum = args.length;
		if (countNum === 0) message.channel.send('Nothing to count');
		else {
			for (let i=0; i<countNum; i++) {
				var emoCount = await countEmoteUses (message, args[i]);
				message.channel.send('Number of instances of ' + args[i] + ': ' + emoCount);
			}
		}
	}

	//EMOJIUSAGE command
	if (command == 'EMOJIUSAGE') {
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

//Count number of uses for an emote
async function countEmoteUses (msg, emote) {
	var emoCounter = 0;
	var msgManager = msg.channel.messages;
	var lastMsg = msg;
	const dateLimit = new Date().getTime() - new Date(halfAnYearInMilliseconds);

	console.log('date limit: ' + dateLimit);

	do {
		var msgList = await msgManager.fetch({limit:100, before:lastMsg.id});
		msgList.each( message => {
			if (message.content.includes(emote)) emoCounter++;
		})
		lastMsg = msgList.last();

		console.log('Last message sent at: ' + lastMsg.createdAt);
		console.log('emoCounter: ' + emoCounter);

	} while (lastMsg.createdAt > dateLimit);

	console.log('Exited loop. Last message sent: ' + lastMsg.createdAt);
	
	return emoCounter;
}

/*-- EMOJIUSAGE stuff --*/
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
