const Discord = require('discord.js');
const DiscordUser = require('./src/common/data/user')
const glob = require('glob');
const emojis = require('./src/helpers/emojis.js');
const prefix = '!';
const client = new Discord.Client();
const halfAnYearInMilliseconds = 15778476000;

let commands = {};
glob.sync('./src/commands/*.js').forEach( function( file ) {
	commands = {...commands, ...require(file)}
});

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
	const command = args.shift().toLowerCase();
	
	const commandList = Object.keys(commands);
	//Look up & execute command in command list
	for (let i=0; i<commandList.length; i++) {
		if (command == commandList[i]) {
			console.log('running ' + commandList[i].name + ' command');
			const user = new DiscordUser(message.author.id, message.author.username, message.guild.name);
			await createIfUserDoesNotExist(user);
			await commands[command].execute({args, message, timeInEpoch: halfAnYearInMilliseconds, user})
			break;
		}
	}
});

async function createIfUserDoesNotExist(user) {
	if (!(await user.confirmExistence())) {
		await user.create();
	}
}
