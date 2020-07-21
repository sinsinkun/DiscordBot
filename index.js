const Discord = require('discord.js');
const DiscordUser = require('./src/common/data/user')
const prefix = '!';
const client = new Discord.Client();
const halfAnYearInMilliseconds = 15778476000;

client.once('ready', () => {
	console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);

client.on('message', async message => {
	//full chat log <--disabled chat log for clearer error logging-->
	//console.log(message.channel.name + ', ' + message.author.username + ': ' + message.content);

	const user = new DiscordUser(message.author.id, message.author.username, message.guild.name);
	if (message.author.bot) return;
	//<--use this command for local tests--> if (!(message.channel.name == 'bot-testing')) return;
	
	// log user emoji usage
	await createIfUserDoesNotExist(user);
	await user.logEmojiUsage(message);

	//parsing commands
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	
	//Look up, confirm existence, & execute command
	try {
		const commandFile = require(`./src/commands/${command}`);
		console.log ('running command: ' + commandFile.name);
		await commandFile.execute({message, args, timeInEpoch:halfAnYearInMilliseconds});
	} catch (error) {
		console.log (error);
		message.channel.send(`Command not found. Please check !help for commands`);
	}
});

async function createIfUserDoesNotExist(user) {
	if (!(await user.confirmExistence())) {
		await user.create();
	}
}
