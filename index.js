const Discord = require('discord.js');
const commands = require('./src/commands/commands')
const emojis = require('./src/helpers/emojis')
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
	
	//ECHO command
	if (command == 'ECHO') {
		commands.echo(message, args)
	}
	
	//COUNT command
	if (command == 'COUNT') {
		await commands.count(message, args, halfAnYearInMilliseconds)
	}

	//EMOJIUSAGE command
	if (command == 'EMOJIUSAGE') {
		await commands.emojiUsage(message, halfAnYearInMilliseconds)
	}
});
