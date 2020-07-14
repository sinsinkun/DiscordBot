const Discord = require('discord.js');
const { prefix, token } = require('./config.json')
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login(token);

client.on('message', message => {
	if (message.author.bot) return;
	if (message.content == "<:sip:701932618110992395>") {
		message.channel.send("<:sip:701932618110992395>")
	}
});