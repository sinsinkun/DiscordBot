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

	if (spammingEmojis(message)) {
		message.channel.send(`oi m8 fvk 0ff wit ur cheeky shit emoji spam ${message.author.toString()}`)
	}

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

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    // eslint-disable-next-line no-constant-condition
    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}