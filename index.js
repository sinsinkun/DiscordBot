const Discord = require('discord.js');
const commandList = require('./src/commands/commandList.json');
const emojis = require('./src/helpers/emojis.js');
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

	if (emojis.spammingEmojis(message)) {
		message.channel.send(`oi m8 fvk 0ff wit ur cheeky shit emoji spam ${message.author.toString()}`)
	}

	//parsing commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toUpperCase();
	
	//Look up & execute command in command list
	for (i=0; i<commandList.length; i++) {
		if (command == commandList[i].name) {
			console.log('running ' + commandList[i].name + ' command');
			await eval(commandList[i].code);
			break;
		}
	}
});
