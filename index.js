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
	//full chat log
	console.log(message.channel.name + ', ' + message.author.username + ': ' + message.content);

	const user = new DiscordUser(message.author.id, message.author.username, message.guild.name);
	await createIfUserDoesNotExist(user);
	await user.logEmojiUsage(message);

	//parsing commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	
	//Look up, confirm existence, & execute command
	try {
		const commandFile = require(`./src/commands/${command}.js`);
		console.log ('running command: ' + commandFile.name);
		console.log ('command description: ' + commandFile.description);
		await commandFile.execute ({message, args, timeInEpoch:halfAnYearInMilliseconds});
	} catch (error) {
		console.log (`Error: ${error}`);
		message.channel.send('Cannot find command');
	}
});

async function createIfUserDoesNotExist(user) {
	if (!(await user.confirmExistence())) {
		await user.create();
	}
}
