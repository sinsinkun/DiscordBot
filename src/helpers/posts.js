async function getPostHistory(message, timeInEpoch) {
	let messageBatch;
	let messages = [];
	const timeLimit = timeInEpoch ? new Date().getTime() - timeInEpoch : null;
	do {
		if (messageBatch && messageBatch.size === 100){
			let lastMessage = messageBatch.last();
			if (timeLimit && lastMessage.createdTimestamp < timeLimit) {
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

module.exports = { getPostHistory };