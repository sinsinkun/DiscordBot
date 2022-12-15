const name = 'ce';
const description = 'Call, add, remove, and browse custom emotes';
const how2use = '\"!ce add <1> <2>\" will let <1> call <2>.\n\"!ce remove <1>\" will remove command <1>.\n\"!ce list\" will list existing commands.';
const Discord = require('discord.js');
const db = require('../common/clients/dynamodb.js');
const region = process.env.AWS_DEFAULT_REGION;
const tableName = 'custom_emotes';
const specialCalls = ['add', 'remove', 'list'];
const emotesPerPage = 12;

async function customEmotes({ message, args }){
    
    const customEmoteList = new db({ tableName: tableName, region: region});

    //Parse args to be easily usable for functions
    let parsedInput = {call:'', inVal:'', outVal:''};
    if (args.length === 0) {
        message.channel.send('No input?');
        return;
    }
    if (args.length > 0) parsedInput.call = args[0].toLowerCase();
    if (args.length > 1) parsedInput.inVal = args[1].toLowerCase();
    if (args.length > 2) {
        //add all subsequent words together to form output
        for (let i=2; i<args.length; i++) {
            parsedInput.outVal += args[i] + ' ';
        }
        parsedInput.outVal = parsedInput.outVal.slice(0,-1);
    }
    
    //Run custom emote
    if (!specialCalls.includes(parsedInput.call)) {
        const output = await customEmoteList.callEmote(parsedInput.call);
        if (output != null) message.channel.send(output);
        else message.channel.send('Custom emote doesn\'t exist.');
    }
    else if (parsedInput.call === 'add') {
        //Make sure standard ce commands aren't added
        if (specialCalls.includes(parsedInput.inVal)) {
            message.channel.send('Now listen here you lil shit');
            return;
        }
        //Check if input exists
        if (parsedInput.inVal.length < 1) {
            message.channel.send('No input, no command');
            return;
        }
        //Check if output exists
        if (parsedInput.outVal.length < 1) {
            message.channel.send('No output, no command');
            return;
        }
        // Check if custom emote already exists
        const output = await customEmoteList.callEmote(parsedInput.inVal);
        if (output != null) message.channel.send('Emote shortcut already in use');
        else {
            //Add custom emote to the DB
            const addSuccess = await customEmoteList.addEmote(parsedInput.inVal, parsedInput.outVal);
            if (addSuccess) message.channel.send(`Added command.`);
            else message.channel.send('Failed to add command.');
        }
    }
    else if (parsedInput.call === 'remove') {
        //Check if input exists
        if (parsedInput.inVal.length < 1) {
            message.channel.send('What are you trying to delete?');
            return;
        }
        //Check if custom emote exists in the DB
        const output = await customEmoteList.callEmote(parsedInput.inVal);
        if (output === null) message.channel.send('Custom Emote doesn\'t exist in the database.');
        else {
            //Remove custom emote from DB
            const removeSuccess = await customEmoteList.removeEmote(parsedInput.inVal);
            if (removeSuccess) message.channel.send(`Removed command \'${parsedInput.inVal}\'`);
            else message.channel.send('Failed to remove command.');
        }
    }
    else if (parsedInput.call === 'list') {
        //List all existing commands
        let emoteArray = await customEmoteList.getEmoteList();
        const numPages = Math.ceil(emoteArray.length/emotesPerPage);
        let pageNum = 1;
        while (emoteArray.length > 0) {
            const printArray = emoteArray.slice(0, emotesPerPage);
            const desc = printArray.reduce((out, emote) => {
                //Trim down long URLs
                let outString = emote.output;
                // TODO: handle special characters
                // if (outString.length > 30) outString = `${outString.slice(0,25)}...`;
                return out + (`**${emote.input}** ][ ${outString}\n`)
            }, "");
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Custom emotes')
                .setDescription(desc)
                .setFooter({ text:`${pageNum}/${numPages}` });
            message.channel.send({ embeds: [embed] });
            pageNum++;
            emoteArray = emoteArray.slice(emotesPerPage);
        }
        // lastMsg.addEmote('➡️');
    }
    else {
        //Command not called correctly
        console.log ('Command was not called correctly');
        message.channel.send('Command was not called correctly, please try again');
    }
}

module.exports.name = name;
module.exports.description = description;
module.exports.how2use = how2use;
module.exports.execute = customEmotes;