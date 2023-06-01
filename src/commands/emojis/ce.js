const { SlashCommandBuilder, Embed } = require('discord.js');
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
    URL:"url"
}

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
                        .setName(stringOptions.URL)
                        .setDescription('Emote image URL to be pasted when invoked')
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
        const customEmoteList = new db({ tableName: tableName, region: region})
        switch(interaction.options.getSubcommand()) {
            case subCommands.EMOTE:
                const input = interaction.options.getString(stringOptions.NAME)
                const emote = await customEmoteList.callEmote(input)
                interaction.reply({ content: emote || `Custom emote doesn\'t exist: ${input}` });
                break;
            case subCommands.LIST:
                interaction.deferReply()
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
                break;
            case subCommands.ADD:
                //Make sure standard ce commands aren't added
                const addName = interaction.options.getString(stringOptions.NAME)
                const addUrl = interaction.options.getString(stringOptions.URL)
                //Check if input exists
                if (!addName) {
                    interaction.reply('No input, no command');
                    break;
                }
                //Check if output exists
                if (!addUrl) {
                    interaction.reply('No output, no command');
                    break;
                }
                if (Object.keys(subCommands).includes(addName.toUpperCase())) {
                    interaction.reply('Now listen here you lil shit');
                    break;
                }
                interaction.deferReply()
                // Check if custom emote already exists
                const output = await customEmoteList.callEmote(addName);
                if (output != null) interaction.followUp('Emote shortcut already in use');
                else {
                    //Add custom emote to the DB
                    const addSuccess = await customEmoteList.addEmote(addName, addUrl);
                    if (addSuccess) interaction.followUp(`Added command.`);
                    else interaction.followUp('Failed to add command.');
                }
                break;
            case subCommands.REMOVE:
                const removeName = interaction.options.getString(stringOptions.NAME)
                //Check if input exists
                if (!removeName) {
                    interaction.reply('What are you trying to delete?');
                    return;
                }
                interaction.deferReply()
                //Check if custom emote exists in the DB
                const removeOutput = await customEmoteList.callEmote(removeName);
                if (removeOutput === null) interaction.followUp('Custom Emote doesn\'t exist in the database.');
                else {
                    //Remove custom emote from DB
                    const removeSuccess = await customEmoteList.removeEmote(removeName);
                    if (removeSuccess) interaction.followUp(`Removed command \'${removeName}\'`);
                    else interaction.followUp('Failed to remove command.');
                }
                break;
            default:
                interaction.reply({ content: 'Command was not called correctly. Try again.'})
        }
	},
};