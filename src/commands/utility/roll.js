const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls die or flips coin. Defaults to coin flip.')
        .addStringOption(option => 
            option
                .setName('dice')
                .setDescription('$x% to roll $ die with % sides each')),
	async execute(interaction) {
        await roll(interaction)
	},
};

async function roll(interaction){
    const dice = interaction.options.getString('dice')
    if (!dice) {
        // coin flip
        const x = Math.round(Math.random());
        if (x === 1) await interaction.reply('Heads');
        else await interaction.reply('Tails');
    }
    else if (dice) {
        // number + (d or x) + number
        const regex = /^[0-9]+?[dx][0-9]+?$/g;
        if (!regex.test(dice)) {
            await interaction.reply('Error calling command. Please use proper syntax.');
        }
        else {
            //use d or x to split sides
            const nums = dice.split(/[dx]/);
            const numDie = parseInt(nums[0]);
            const dieSides = parseInt(nums[1]);
            console.log(`${numDie} x ${dieSides}`);
            //exception for too large numbers
            if (numDie > 1000 || dieSides > 1000) {
                await interaction.reply('<:ah:732553833397354556>');
                return;
            }
            //calculate total
            let dieArray = [];
            let dieSum = 0;
            for (let i=0; i<numDie; i++) {
                dieArray[i] = Math.floor(Math.random()*dieSides)+1;
                dieSum += dieArray[i];
            }
            //compose message
            let dieArrayStr = `Rolling ${dice}:\n`;
            dieArray.forEach(dieVal => dieArrayStr += `${dieVal}, `);
            dieArrayStr = dieArrayStr.slice(0,-2);
            dieArrayStr += `\ntotal sum: ${dieSum}`;
            await interaction.reply(dieArrayStr);
        }
    }
    else await interaction.reply('Error calling command. Please use proper syntax.');
}