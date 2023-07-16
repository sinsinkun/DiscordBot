const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('convert')
		.setDescription('Converts between celsius:farenheit, miles:kilometers, feet:centimeters, kilograms:pounds')
		.addStringOption(option =>
			option
				.setName('value')
				.setDescription('Value to be converted. Can contain unit. Ex: 12ft')
				.setRequired(true))
		.addStringOption(option => 
			option
				.setName('unit')
				.setDescription('Unit to be converted')
				.addChoices(
					{ name: 'Celsius', value: 'C'},
					{ name: 'Farenheit', value: 'F'},
					{ name: 'Kilometres', value: 'KM'},
					{ name: 'Miles', value: 'MI'},
					{ name: 'Centimetres', value: 'CM'},
					{ name: 'Metres', value: 'M'},
					{ name: 'Feet', value: 'FT'},
					{ name: 'Inches', value: 'IN'},
					{ name: 'Kilograms', value: 'KG'},
					{ name: 'Pounds', value: 'LB'},
					{ name: 'Millilitres', value: 'ML'},
					{ name: 'Ounces', value: 'OZ'}
				))
		,
	async execute(interaction) {
        await convert(interaction)
	},
};

async function convert(interaction) {
	const unit = interaction.options.getString('unit')
	const value = interaction.options.getString('value')
	// parse input with unit attached to value
	if (!unit) {
		let parsedUnit = value.replace(/[^a-z|^A-Z]/g,"").toUpperCase()
		let parsedValue = Number(value.replace(/[^0-9\.\-]/g,""))
		// parse []ft[]in 
		if (parsedUnit === "FTIN") {
			const reParse = value.split(/[ft|Ft|FT]/)
			const ft = Number(reParse[0].replace(/[^0-9\.\-]/g,""))
			const inches = Number(reParse[2].replace(/[^0-9\.]/g,""))
			parsedValue = ft*12 + inches
			parsedUnit = "IN"
		}
		if (isNaN(parsedValue)) {
			await interaction.reply("Invalid value")
			return
		};
		const output = convertByUnit(parsedValue, parsedUnit)
		if (output) {
			await interaction.reply(`${value}${unit} -> ${output}`)
			return
		} else {
			// could not find valid input
			await interaction.reply("Invalid input")
			return
		}
	}
	// parse input with unit separated from value
	let parsedValue = Number(value)
	// parse []ft []in
	const testForFt = value.replace(/[^a-z,^A-Z]/g,"").toUpperCase()
	const testForIn = unit
	if (testForFt === "FT" && testForIn === "IN") {
		const ft = value
		const inches = Number(unit.replace(/[^0-9.-]/g,""))
		value = ft*12 + inches
		unit = "IN"
	}
	if (isNaN(parsedValue)) { 
		await interaction.reply("Invalid value")
		return
	}
	const output = convertByUnit(value, unit)
	if (output) {
		await interaction.reply(`${value}${unit} -> ${output}`)
		return
	} else {
		// could not find valid input
		await interaction.reply("Invalid input")
		return
	}
}

// actual calculations
function convertByUnit(value, unit) {
	switch (unit) {
		case "F":
			const tempC = (value - 32) / 1.8
			return `${tempC.toFixed(2)}C`
		case "C":
			const tempF = value*1.8 + 32
			return `${tempF.toFixed(2)}F`
		case "KM":
			const distMiles = value*0.62137
			return `${distMiles.toFixed(2)} miles`
		case "MILES":
			const distKM = value/0.62137
			return `${distKM.toFixed(2)}km`
		case "CM":
			const distDec = value/2.54
			let distFT = Math.floor(distDec/12)
			let distIN = Math.round(distDec%12)
			return `${distFT}ft ${distIN}in`
		case "M":
			const distDec2 = value/0.0254
			let distFT2 = Math.floor(distDec2/12)
			let distIN2 = Math.round(distDec2%12)
			return `${distFT2}ft ${distIN2}in`
		case "FT":
			const distCM = value*30.48
			return `${distCM}cm`
		case "IN":
			const distCM2 = value*2.54
			return `${distCM2}cm`
		case "KG":
			const weightLbs = value*2.2046
			return `${weightLbs.toFixed(2)}lbs`
		case "POUNDS":
			const weightKg = value/2.2046
			return `${weightKg.toFixed(2)}kg`
		case "ML":
			const fluidOz = value*0.033814
			return `${fluidOz.toFixed(2)}oz`
		case "OZ":
			const fluidMl = value/0.033814
			return `${fluidMl.toFixed(2)}ml`
		default:
			console.log("Could not find matching unit", unit)
			break
	}
}