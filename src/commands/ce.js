const name = 'ce';
const description = 'Call, add, remove, and browse custom emotes';
const Discord = require('discord.js');
const customList = require('../common/data/customlist.json');

function customEmotes({ message, args }){

    //Remap args to be lower case only
    const regexC = args.map( eachArg => eachArg.toLowerCase());

    //Run custom emote
    for (i=0;i<customList.length;i++) {
        if (regexC[0] == customList[i].key) {
            console.log (`Calling command ${customList[i].key}`);
            message.channel.send(customList[i].call);
        }
    }

    if (regexC[0] == 'add' && regexC.length == 3) {
        //Check if custom emote already exists
        if (emoteExists(regexC[1])) {
            message.channel.send('Emote shortcut already in use');
        }
        //Make sure standard ce commands aren't added
        else if (regexC[1] == ('add' || 'remove' || 'list')) {
            message.channel.send('Now listen here you lil shit');
        }
        else {
            console.log (`Add calling \'${regexC[1]}\' to perform \'${regexC[2]}\'`);
            customList.push({key: regexC[1], call: regexC[2]});
        }
    }
    else if (regexC[0] == 'remove' && regexC.length == 2) {
        //Check if custom emote exists
        if (emoteExists(regexC[1])) {
            console.log (`Remove calling \'${regexC[1]}\' to perform \'${regexC[2]}\'`);
        }
        else {
            message.channel.send('Emote doesn\'t exist.');
        }
    }
    else if (regexC[0] == 'list' && regexC.length == 1) {
        //List all existing commands
        console.log ('Listing all commands');
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Custom emotes')
            .addFields (...customList.map(listVal => {return {name: `${listVal.key}`, value: `${listVal.call}`}}));
        message.channel.send(embed);
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
module.exports.execute = customEmotes;