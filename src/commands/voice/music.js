const { SlashCommandBuilder } = require('discord.js')
const {
    useMasterPlayer, useQueue, EqualizerConfigurationPreset
  } = require('discord-player')

  const subCommands = {
    PLAY: 'play',
    SKIP: 'skip'
  }

  let volume = 5

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Music handling commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName(subCommands.PLAY)
                .setDescription('Play Youtube music in the voice channel you\'re currently in.')
                .addStringOption(option => 
                    option
                        .setName('query')
                        .setDescription('URL or title of Youtube video to play.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(subCommands.SKIP)
                .setDescription('Skips the current song.')),
	async execute(interaction) {
        // let's defer the interaction as things can take time to process
        await interaction.deferReply();
        switch(interaction.options.getSubcommand()) {
            case subCommands.PLAY:
                await play(interaction)
                break;
            case subCommands.SKIP:
                await skip(interaction)
                break;
            default:
                interaction.reply({ content: 'Command was not called correctly. Try again.'})
        }
	},
};

async function play(interaction){
    const channel = interaction.member.voice.channel
    if (!channel) return interaction.reply('You are not connected to a voice channel!') // make sure we have a voice channel
    const query = interaction.options.getString('query', true) // we need input/query to play

    try {
        const { track } = await useMasterPlayer().play(channel, query, {
            requestedBy: interaction.user,
            volume,
            nodeOptions: {
                // nodeOptions are the options for guild node (aka your queue in simple word)
                metadata: interaction // we can access this metadata object using queue.metadata later on
            }
        });

        return interaction.followUp(`**${track.title}** enqueued!`)
    } catch (e) {
        // let's return error if something failed
        return interaction.followUp(`Something went wrong: ${e}`)
    }
}

async function skip(interaction){
    const channel = interaction.member.voice.channel
    if (!channel) return interaction.reply('You are not connected to a voice channel!') // make sure we have a voice channel
    try {
        const queue = useQueue(interaction.guild.id)
        const toSkip = queue.currentTrack.title
        queue.node.skip()
        return interaction.followUp(`**${toSkip}** skipped!`)
    } catch (error) {
        return interaction.followUp(`Something went wrong: ${e}`)
    }
}