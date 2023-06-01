const name = 'echo';
const description = 'Echoes what the user inputs. Defaults to echo.';

function echo({ message, args }){
    if (args.length < 1) message.channel.send('echo');
    else {
        let argsString = '';
        args.forEach(arg => argsString = argsString + ' ' + arg);
        message.channel.send(argsString);
    }
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = echo;