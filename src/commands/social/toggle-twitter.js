const { SlashCommandBuilder, ChannelType } = require('discord.js');
const TwitterScrape = require('../../passive/twitter-scrape')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('twitter')
		.setDescription('Commands for handling bot twitter interactions.')
		.addBooleanOption(option =>
			option
				.setName('preview-toggle')
				.setDescription('Toggle on/off previews from twitter posts.'))
		,
	async execute(interaction) {
        await interaction.deferReply();
        await toggleTwitterPreviews(interaction);
	},
};

function toggleTwitterPreviews(interaction) {
    TwitterScrape.toggled = interaction.options.getBoolean('preview-toggle', true);
    return interaction.followUp(`Twitter previews has been ${TwitterScrape.toggled ? 'enabled' : 'disabled'}!`)
}