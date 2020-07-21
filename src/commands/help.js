const name = 'help';
const glob = require('glob');
const description = 'Lists commands. Use !help <command> for more info';

let commandList = {};
glob.sync('./src/commands/*.js').forEach( file => {
    commandList = {...commandList, ...require(file)};
});

function help({ message, args }){
    if (args.length < 1) {
        //List commands
        console.log (`Command list: ${commandList.name}`);
    }
    else {
        //Call help for specific command
        let argsString = '';
        args.forEach(arg => argsString = argsString + ' ' + arg);
        message.channel.send(argsString);
    }
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = help;