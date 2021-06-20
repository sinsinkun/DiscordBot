const name = 'convert';
const description = 'Converts between celsius:farenheit, miles:kilometers, feet:centimeters';

async function convert({ message, args }) {

	// actual calculations
    function convertByUnit(value, unit) {
		// TO-DO: feet/inches bullshit
		switch (unit) {
			case "F":
				const tempC = (value - 32) / 1.8;
				return `${tempC.toFixed(2)}C`;
			case "C":
				const tempF = value*1.8 + 32;
				return `${tempF.toFixed(2)}F`;
			case "KM":
				const distMiles = value*0.62137;
				return `${distMiles.toFixed(2)} miles`;
			case "MI":
			case "MILES":
				const distKM = value/0.62137;
				return `${distKM.toFixed(2)}km`;
			case "CM":
				const distDec = value/2.54;
				let distFT = Math.floor(distDec/12);
				let distIN = Math.round(distDec%12);
				return `${distFT}ft ${distIN}in`;
			case "M":
				const distDec2 = value/0.0254;
				let distFT2 = Math.floor(distDec2/12);
				let distIN2 = Math.round(distDec2%12);
				return `${distFT2}ft ${distIN2}in`;
			default:
				console.log("Could not find matching unit", unit);
				break;
		}
	}
	// parse input with unit attached to value
	if (args.length === 1) {
		const unit = args[0].replace(/[^a-z,^A-Z]/g,"").toUpperCase();
		const value = Number(args[0].replace(/[^0-9.-]/g,""));
		if (isNaN(value)) return message.channel.send("Invalid value");
		const output = convertByUnit(value, unit);
		if (output) return message.channel.send(output);
	}
	// parse input with unit separated from value
	if (args.length === 2) {
		const unit = args[1].replace(/[^a-z,^A-Z]/g,"").toUpperCase();
		const value = Number(args[0].replace(/[^0-9.-]/g,""));
		if (isNaN(value)) return message.channel.send("Invalid value");
		const output = convertByUnit(value, unit);
		if (output) return message.channel.send(output);
	}
	// could not find valid input
	message.channel.send("Invalid input");
}

module.exports.name = name;
module.exports.description = description;
module.exports.execute = convert;