const name = 'roll';
const description = 'Rolls die or flips coin.';
const how2use = '!roll for coin flip. !roll $x% to roll $ die with % sides each';

function roll({ message, args }){
    if (args.length < 1) {
        // dice roll
        const x = Math.round(Math.random());
        if (x === 1) message.channel.send('Heads');
        else message.channel.send('Tails');
    }
    else if (args.length === 1) {
        const argsChars = [...args[0]];
        if (argsChars[0] === 'x' || argsChars[argsChars.length-1] === 'x' || argsChars.length < 3) {
            message.channel.send('Error calling command. Please use proper syntax.');
        }
        else {
            //use x to split sides
            let numDie, dieSides, temp = '';
            for (let i=0; i<argsChars.length; i++) {
                if (argsChars[i] != 'x') temp += argsChars[i];
                else {
                    numDie = parseInt(temp); 
                    temp = '';
                }
            }
            dieSides = parseInt(temp);
            console.log(`${numDie} x ${dieSides}`);
            //calculate total
            let dieArray = [];
            let dieSum = 0;
            for (let i=0; i<numDie; i++) {
                dieArray[i] = Math.floor(Math.random()*dieSides)+1;
                dieSum += dieArray[i];
            }
            //compose message
            let dieArrayStr = '';
            dieArray.forEach(dieVal => dieArrayStr += `${dieVal}, `);
            dieArrayStr = dieArrayStr.slice(0,-2);
            dieArrayStr += `\ntotal sum: ${dieSum}`;
            message.channel.send(dieArrayStr);
        }
    }
    else message.channel.send('Error calling command. Please use proper syntax.');
}

module.exports.name = name;
module.exports.description = description;
module.exports.how2use = how2use;
module.exports.execute = roll;