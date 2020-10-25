const name = 'ce';
const description = 'Call, add, remove, and browse custom emotes';
const how2use = '\"!ce add <1> <2>\" will let <1> call <2>.\n\"!ce remove <1>\" will remove command <1>.\n\"!ce list\" will list existing commands.';
const Discord = require('discord.js');
const db = require('../common/data/customlist.js');

function customEmotes({ message, args }){

    //Remap args to be lower case only
    const regexC = args.map( eachArg => eachArg.toLowerCase());
    const customList = new db;
    const output = customList.call(regexC[0]);

    //Run custom emote
    if (regexC[0] != 'add' && regexC[0] != 'remove' && regexC[0] != 'list') {
        console.log(output);
        //if (output != null) message.channel.send(output);
    }
    else if (regexC[0] === 'add' && regexC.length === 3) {
        //Make sure standard ce commands aren't added
        if (regexC[1] === ('add' || 'remove' || 'list')) {
            message.channel.send('Now listen here you lil shit');
        }
        //Check if custom emote already exists
        else if (output != null) {
            message.channel.send('Emote shortcut already in use');
        }
        //Add custom emote to database
        else {
            console.log (`Add calling \'${regexC[1]}\' to perform \'${regexC[2]}\'`);
            customDB.add(regexC[1], regexC[2]);
        }
    }
    else if (regexC[0] === 'remove' && regexC.length === 2) {
        //Check if custom emote exists
        if (output != null) {
            console.log (`Remove calling \'${regexC[1]}\' to perform \'${regexC[2]}\'`);
            customDB.remove(regexC[1]);
        }
        else {
            message.channel.send('Emote doesn\'t exist.');
        }
    }
    else if (regexC[0] === 'list' && regexC.length == 1) {
        //List all existing commands
        console.log ('Listing all commands');
        /* const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Custom emotes')
            .addFields (...customList.map(listVal => {return {name: `${listVal.key}`, value: `${listVal.call}`}}));
        message.channel.send(embed); */
    }
    else {
        //Command not called correctly
        console.log ('Command was not called correctly');
        message.channel.send('Command was not called correctly, please try again');
    }

}

function emoteExists(emoteKey) {
    for (i=0; i<customList.length; i++) {
        if (customList[i].key == emoteKey) return true;
    }
    return false;
}

module.exports.name = name;
module.exports.description = description;
module.exports.how2use = how2use;
module.exports.execute = customEmotes;