const Discord = require('discord.js');
const { occurrences } = require('./external');

function getCustomEmojis(message) {
	let customEmojis = message.guild.emojis.cache.map(emoji => {
		return { name: `:${emoji.name}:${emoji.id}`, value: "0"};
	})
	return customEmojis;
}

function tabulateEmojis(emojis, postHistory) {
	postHistory.forEach(message => {
		emojis.forEach(emoji => {
			const count = occurrences(message[1].content, emoji.name, false);
			if (count > 1){
				emoji.value = (parseInt(emoji.value) + (count > 3 ? 3 : count)).toString();
			}
		})
	})
	emojis = emojis.sort((a,b) => b.value - a.value)
	return new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle('Custom server emojis ordered by most used')
					.addFields(...emojis.map(emoji => { return { name: `<${emoji.name}>`, value: emoji.value, inline:true }}));
}

function spammingEmojis(message) {
	const emojis = getCustomEmojis(message);
	for (let i=0;i<emojis.length;i++){
		let count = occurrences(message.content, emojis[i].name, false);
		if (count >= 3) {
			return true;
		}
	}
	return false;
}

//Count number of uses for an emote
async function countEmoteUses (msg, emote, timeInEpoch) {
	var emoCounter = 0;
	var msgManager = msg.channel.messages;
	var lastMsg = msg;
	const dateLimit = new Date().getTime() - new Date(timeInEpoch);

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

module.exports = { getCustomEmojis, tabulateEmojis, spammingEmojis, countEmoteUses };