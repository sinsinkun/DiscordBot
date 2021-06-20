const name = 'convert';
const description = 'Converts between celsius:farenheit, miles:kilometers, feet:centimeters';

async function convert({ message, args }) {

	// actual calculations
	function convertByUnit(value, unit) {
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
			case "MILE":
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
			case "FT":
				const distCM = value*30.48;
				return `${distCM}cm`;
			case "IN":
				const distCM2 = value*2.54;
				return `${distCM2}cm`;
			default:
				console.log("Could not find matching unit", unit);
				break;
		}
	}
	// parse input with unit attached to value
	if (args.length === 1) {
		let unit = args[0].replace(/[^a-z|^A-Z]/g,"").toUpperCase();
		let value = Number(args[0].replace(/[^0-9\.\-]/g,""));
		// parse []ft[]in 
		if (unit === "FTIN") {
			const reParse = args[0].split(/[ft|Ft|FT]/);
			const ft = Number(reParse[0].replace(/[^0-9\.\-]/g,""));
			const inches = Number(reParse[2].replace(/[^0-9\.]/g,""));
			value = ft*12 + inches;
			unit = "IN";
		}
		if (isNaN(value)) return message.channel.send("Invalid value");
		const output = convertByUnit(value, unit);
		if (output) return message.channel.send(output);
	}
	// parse input with unit separated from value
	if (args.length === 2) {
		let unit = args[1].replace(/[^a-z,^A-Z]/g,"").toUpperCase();
		let value = Number(args[0].replace(/[^0-9.-]/g,""));
		// parse []ft []in
		const testForFt = args[0].replace(/[^a-z,^A-Z]/g,"").toUpperCase();
		const testForIn = unit;
		if (testForFt === "FT" && testForIn === "IN") {
			const ft = value;
			const inches = Number(args[1].replace(/[^0-9.-]/g,""));
			value = ft*12 + inches;
			unit = "IN";
		}
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