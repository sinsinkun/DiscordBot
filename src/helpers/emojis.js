function getCustomEmojis(message) {
	let customEmojis = message.guild.emojis.cache.map(emoji => {
		return { [`:${emoji.name}:${emoji.id}`]: 0 };
	})
	return customEmojis;
}

	// return new Discord.MessageEmbed()
	// 				.setColor('#0099ff')
	// 				.setTitle('Custom server emojis ordered by most used')
	// 				.addFields(...emojis.map(emoji => { return { name: `<${emoji.name}>`, value: emoji.value, inline:true }}));

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

module.exports = { getCustomEmojis, countEmoteUses };