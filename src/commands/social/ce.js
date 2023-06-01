const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const subCommands = {
    EMOTE:'emote',
    ADD:'add',
    REMOVE:'remove',
    LIST:'list'
}
const stringOptions = {
    NAME:'name',
    VALUE:"value"
}

// Create DB connection once, then reuse same connection.
const EmoteCache = require('../../helpers/emoteCache')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ce')
		.setDescription('Call, add, remove, and browse custom emotes')
        .addSubcommand(subcommand =>
            subcommand
                .setName(subCommands.EMOTE)
                .setDescription('Invoke a custom emote')
                .addStringOption(option => 
                    option
                        .setName(stringOptions.NAME)
                        .setDescription('Emote name to invoke')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(subCommands.ADD)
                .setDescription('Add a custom emote')
                .addStringOption(option =>
                    option
                        .setName(stringOptions.NAME)
                        .setDescription('Emote name to be invoked with')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName(stringOptions.VALUE)
                        .setDescription('Value to be returned by emote call. Can be URL or text.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(subCommands.REMOVE)
                .setDescription('Remove an emote from custom emotes')
                .addStringOption(option =>
                    option
                        .setName(stringOptions.NAME)
                        .setDescription('Emote name to be removed')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(subCommands.LIST)
                .setDescription('List available custom emojis')
        ),
    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices;

        if (focusedOption.name === stringOptions.NAME) {
            choices = await EmoteCache.list();
        }

        const filtered = choices.filter(choice => choice.input.startsWith(focusedOption.value));
        await interaction.respond(
            filtered.map(choice => ({ name: choice.input, value: choice.input })).slice(0, 25),
        );
    },
	async execute(interaction) {
        await interaction.deferReply()
        switch(interaction.options.getSubcommand()) {
            case subCommands.EMOTE:
                await callCustomEmote(interaction)
                break;
            case subCommands.LIST:
                await listEmotes(interaction)
                break;
            case subCommands.ADD:
                await addCustomEmote(interaction)
                break;
            case subCommands.REMOVE:
                await removeCustomEmote(interaction)
                break;
            default:
                interaction.reply({ content: 'Command was not called correctly. Try again.'})
        }
	},
};

async function callCustomEmote(interaction) {
    const input = interaction.options.getString(stringOptions.NAME)
    const emote = await EmoteCache.find(input)
    await interaction.followUp({ content: emote.output || `Custom emote doesn\'t exist: ${input}` });
}

async function listEmotes(interaction) {
    let emoteArray = await EmoteCache.listClone()

    const emotesPerPage = 20
    const numPages = Math.ceil(emoteArray.length/emotesPerPage)
    let pageNum = 1
    while (emoteArray.length > 0) {
        const printArray = emoteArray.slice(0, emotesPerPage)
        const desc = printArray.reduce((out, emote) => {
            //Trim down long URLs
            let outString = emote.output
            // TODO: handle special characters
            // if (outString.length > 30) outString = `${outString.slice(0,25)}...`
            return out + (`**${emote.input}** ][ ${outString}\n`)
        }, "")
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Custom emotes')
            .setDescription(desc)
            .setFooter({ text:`${pageNum}/${numPages}` })
        await interaction.followUp({ embeds: [embed] })
        pageNum++
        emoteArray = emoteArray.slice(emotesPerPage)
    }
}

async function addCustomEmote(interaction) {
    const name = interaction.options.getString(stringOptions.NAME)
    const value = interaction.options.getString(stringOptions.VALUE)

    //Make sure standard ce commands aren't added
    if (Object.keys(subCommands).includes(name.toUpperCase())) {
        await interaction.followUp('Now listen here you lil shit')
        return
    }

    // Check if custom emote already exists
    const index = await EmoteCache.find(name)
    if (index) await interaction.followUp('Emote shortcut already in use')
    else {
        //Add custom emote to the DB
        const addSuccess = await EmoteCache.add(name, value)
        // Return results
        if (addSuccess) await interaction.followUp(`Added command.`)
        else await interaction.followUp('Failed to add command.')
    }
}

async function removeCustomEmote(interaction) {
    const name = interaction.options.getString(stringOptions.NAME)
    //Check if custom emote exists in the DB
    const index = await EmoteCache.find(name)
    if (!index) await interaction.followUp(`Custom Emote doesn\'t exist in the database: ${name}`)
    else {
        //Remove custom emote from DB
        const removeSuccess = await EmoteCache.remove(name)
        // Return results
        if (removeSuccess) await interaction.followUp(`Removed command \'${name}\'`)
        else await interaction.followUp('Failed to remove command.')
    }
}