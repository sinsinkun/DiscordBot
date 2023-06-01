const { SlashCommandBuilder, ChannelType } = require('discord.js');
const DiscordUser = require('../../common/data/user');
const DiscordServer = require('../../common/data/server');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stickerusage')
		.setDescription('Tallies top 25 stickers of all time for server or @user.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Specific user you\'d like to see results for. Default is server-wide.'))
		.addStringOption(option => 
			option
				.setName('order')
				.setDescription('In which order to display top results. Defaults to descending.')
				.addChoices(
					{ name: 'Ascending', value: 'ASC'},
					{ name: 'Descending', value: 'DESC'}
				))
		,
	async execute(interaction) {
        await interaction.deferReply()
        await stickerUsage(interaction)
	},
};

async function stickerUsage(interaction) {
    if (!interaction.guild.available || interaction.channel.type !== ChannelType.GuildText) {
        // This is an error.
        return;
    }
    try {
        const fetchedUser = interaction.options.getUser('user')
        const order = interaction.options.getString('order') || 'DESC'
        if (!fetchedUser) {
            const server = new DiscordServer(interaction.guild.id, interaction.guild.name)
            const stickersUsed = await server.writeStickerUsage(order === 'ASC');
            await interaction.followUp({ embeds : [stickersUsed] });
        }
        else if (fetchedUser) { // @user in message
            const {id, username} = fetchedUser;
            const user = new DiscordUser(id, username, interaction.guild.name, interaction.guild.id); // create new instance of user
            const stickersUsed = await user.writeStickerUsage(order === 'ASC');
            await interaction.followUp({ embeds : [stickersUsed] });
        } 
    } catch (error) {
        await interaction.followUp(error.message);
    } 
}