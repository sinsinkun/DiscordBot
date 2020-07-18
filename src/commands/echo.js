function execute({message, args}){
    if (args.length < 1) message.channel.send('echo');
    else {
        let argsString = '';
        args.forEach(arg => argsString = argsString + ' ' + arg);
        message.channel.send(argsString);
    }
}

module.exports = { echo: { execute } }