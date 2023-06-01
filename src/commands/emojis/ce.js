const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const db = require('../../common/clients/dynamodb.js');
const region = process.env.AWS_DEFAULT_REGION;
const tableName = 'custom_emotes';
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
const customEmoteList = new db({ tableName: tableName, region: region})

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
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(subCommands.LIST)
                .setDescription('List available custom emojis')
        ),
	async execute(interaction) {
        interaction.deferReply()
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
    const emote = await customEmoteList.callEmote(input)
    interaction.followUp({ content: emote || `Custom emote doesn\'t exist: ${input}` });
}

async function listEmotes(interaction) {
    let emoteArray = await customEmoteList.getEmoteList()
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
        interaction.followUp({ embeds: [embed] })
        pageNum++
        emoteArray = emoteArray.slice(emotesPerPage)
    }
}

async function addCustomEmote(interaction) {
    const name = interaction.options.getString(stringOptions.NAME)
    const value = interaction.options.getString(stringOptions.VALUE)

    //Make sure standard ce commands aren't added
    if (Object.keys(subCommands).includes(name.toUpperCase())) {
        interaction.followUp('Now listen here you lil shit');
        return;
    }

    // Check if custom emote already exists
    const output = await customEmoteList.callEmote(name);
    if (output != null) interaction.followUp('Emote shortcut already in use');
    else {
        //Add custom emote to the DB
        const addSuccess = await customEmoteList.addEmote(name, value);
        if (addSuccess) interaction.followUp(`Added command.`);
        else interaction.followUp('Failed to add command.');
    }
}

async function removeCustomEmote(interaction) {
    const name = interaction.options.getString(stringOptions.NAME)
    //Check if custom emote exists in the DB
    const emote = await customEmoteList.callEmote(name);
    if (emote === null) interaction.followUp(`Custom Emote doesn\'t exist in the database: ${name}`);
    else {
        //Remove custom emote from DB
        const removeSuccess = await customEmoteList.removeEmote(name);
        if (removeSuccess) interaction.followUp(`Removed command \'${name}\'`);
        else interaction.followUp('Failed to remove command.');
    }
}