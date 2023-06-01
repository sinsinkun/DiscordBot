const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Echoes what the user inputs. Defaults to echo.')
        .addStringOption(option => 
            option
                .setName('value')
                .setDescription('Value to be echoed')),
	async execute(interaction) {
        interaction.reply(interaction.options.getString('value') || 'echo')
	},
};