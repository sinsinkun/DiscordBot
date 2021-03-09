const Discord = require('discord.js');
const name = 'help';
const glob = require('glob');
const description = 'Lists commands. Use !help <command> for more info';

let commandList = [];
const fileList = glob.sync('./src/commands/*.js');
fileList.forEach(file => {
    commandList.push(require(file.replace('src/commands/','')));
});

function help({ message, args }){
    if (args.length < 1) {
        //List commands
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Available commands:')
            .addFields (...commandList.map(command => {return {name: `${command.name}`, value: `${command.description}`}}));
        message.channel.send(embed);
    }
    else {
        //Call help for specific command
        let commandNotFound = true;
        commandList.forEach(command => {
            if (args[0] == command.name) {
                message.channel.send(command.description);
                if (command.how2use != undefined) message.channel.send(command.how2use);
                commandNotFound = false;
            }
        })
        if (commandNotFound) message.channel.send(`Command \'${args[0]}\' not found. Please try again.`);
    }
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = help;
