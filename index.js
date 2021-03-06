const Discord = require('discord.js');
const DiscordUser = require('./src/common/data/user')
const DiscordServer = require('./src/common/data/server');
const prefix = process.env.PREFIX;
const client = new Discord.Client();
const halfAnYearInMilliseconds = 15778476000;

client.once('ready', () => {
	console.log('Ready!');
});

client.login(process.env.BOT_TOKEN);

client.on('message', async message => {
	//full chat log <--disabled chat log for clearer error logging-->
	//console.log(message.channel.name + ', ' + message.author.username + ': ' + message.content);

	if (message.author.bot) return;
	
	// log emoji usage
	const discordData = await getDiscordData(message);
	await logEmojiUsage(message, discordData);

	//parsing commands
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	
	//Look up, confirm existence, & execute command
	try {
		const commandFile = require(`./src/commands/${command}`);
		console.log ('running command: ' + commandFile.name);
		await commandFile.execute({message, args, timeInEpoch:halfAnYearInMilliseconds, discordData});
	} catch (error) {
		console.log (error);
		message.channel.send(`Command not found. Please check !help for commands`);
	}
});

async function getDiscordData(message) {
	const user = new DiscordUser(message.author.id, message.author.username, message.guild.name, message.guild.id);
	const server = new DiscordServer(message.guild.id, message.guild.name);
	if (!(await user.confirmExistence())) {
		await user.create(message);
	}
	if (!(await server.confirmExistence())) {
		await server.create(message);
	}
	return { user, server }
}

async function logEmojiUsage(message, discordData) {
	await discordData.user.logEmojiUsage(message);
	await discordData.server.logEmojiUsage(message);
}