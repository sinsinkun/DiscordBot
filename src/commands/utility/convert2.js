const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js')

const unitType = {
  Temperature: 1,
  Distance: 2,
  Weight: 3,
}

/**
 * @param {number} x 
 * @returns {string}
 */
function ftToftIn(x) {
  let xft = Math.trunc(x);
  let xin = (x - xft) * 12;
  return `${xft}ft ${xin.toFixed(2)}in`;
}

/**
 * @param {number} x 
 * @returns {string}
 */
function inToftIn(x) {
  let xft = Math.floor(x / 12);
  let xin = x - (ft * 12);
  return `${xft}ft ${xin.toFixed(2)}in`;
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertC(value, unitOut) {
  switch (unitOut) {
    case "C":
      return `${value}C`;
    case "F":
      const o1 = value * 1.8 + 32;
			return `${o1.toFixed(2)}F`;
    case "K":
      const o2 = value + 273.15;
      return `${o2.toFixed(2)}K`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertF(value, unitOut) {
  switch (unitOut) {
    case "C":
      const o1 = (value - 32) / 1.8;
			return `${o1.toFixed(2)}C`;
    case "F":
      return `${value}F`;
    case "K":
      const o2 = (value - 32) / 1.8 + 273.15;
      return `${o2.toFixed(2)}K`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertMm(value, unitOut) {
  switch (unitOut) {
    case "MM":
      return `${value}mm`;
    case "CM":
      return `${value / 10}cm`;
    case "M":
      return `${value / 1000}m`;
    case "KM":
      return `${value / 1000000}km`;
    case "MI":
      let o1 = value / (1000 * 1609);
      return `${o1.toFixed(8)}miles`;
    case "FT":
      let o2 = (value / 1000) * 3.281;
      return `${o2.toFixed(4)}ft (${ftToftIn(o2)})`;
    case "IN":
      let o3 = (value / 1000) * 39.37;
      return `${o3.toFixed(4)}in (${inToftIn(o3)})`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertCm(value, unitOut) {
  switch (unitOut) {
    case "MM":
      return `${value * 10}mm`;
    case "CM":
      return `${value}cm`;
    case "M":
      return `${value / 100}m`;
    case "KM":
      return `${value / 100000}km`;
    case "MI":
      let o1 = value / (100 * 1609);
      return `${o1.toFixed(4)}miles`;
    case "FT":
      let o2 = (value / 100) * 3.281;
      return `${o2.toFixed(2)}ft (${ftToftIn(o2)})`;
    case "IN":
      let o3 = (value / 100) * 39.37;
      return `${o3.toFixed(2)}in (${inToftIn(o3)})`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertM(value, unitOut) {
  switch (unitOut) {
    case "MM":
      return `${value * 1000}mm`;
    case "CM":
      return `${value * 10}cm`;
    case "M":
      return `${value}m`;
    case "KM":
      return `${value / 1000}km`;
    case "MI":
      let o1 = value / 1609;
      return `${o1.toFixed(4)}miles`;
    case "FT":
      let o2 = value * 3.281;
      return `${o2.toFixed(2)}ft (${ftToftIn(o2)})`;
    case "IN":
      let o3 = value * 39.37;
      return `${o3.toFixed(2)}in (${inToftIn(o3)})`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertKm(value, unitOut) {
  switch (unitOut) {
    case "MM":
      return `${value * 1000000}mm`;
    case "CM":
      return `${value * 100000}cm`;
    case "M":
      return `${value * 1000}m`;
    case "KM":
      return `${value}km`;
    case "MI":
      let o1 = (value * 1000) / 1609;
      return `${o1.toFixed(2)}miles`;
    case "FT":
      let o2 = (value * 1000) * 3.281;
      return `${o2.toFixed(2)}ft (${ftToftIn(o2)})`;
    case "IN":
      let o3 = (value * 1000) * 39.37;
      return `${o3.toFixed(2)}in (${inToftIn(o3)})`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertMi(value, unitOut) {
  let m = value * 1609;
  switch (unitOut) {
    case "MM":
      return `${(m * 1000000).toFixed(2)}mm`;
    case "CM":
      return `${(m * 100000).toFixed(2)}cm`;
    case "M":
      return `${m.toFixed(2)}m`;
    case "KM":
      return `${(m / 1000).toFixed(4)}km`;
    case "MI":
      return `${value}miles`;
    case "FT":
      let o2 = value * 5280;
      return `${o2.toFixed(2)}ft (${ftToftIn(o2)})`;
    case "IN":
      let o3 = value * 63360;
      return `${o3.toFixed(2)}in (${inToftIn(o3)})`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertFt(value, unitOut) {
  let m = value / 3.281;
  switch (unitOut) {
    case "MM":
      return `${(m * 1000000).toFixed(2)}mm`;
    case "CM":
      return `${(m * 100000).toFixed(2)}cm`;
    case "M":
      return `${m.toFixed(2)}m`;
    case "KM":
      return `${(m / 1000).toFixed(4)}km`;
    case "MI":
      let o1 = value / 5280;
      return `${o1.toFixed(4)}miles`;
    case "FT":
      return `${value}ft (${ftToftIn(value)})`;
    case "IN":
      let o3 = value * 12;
      return `${o3}in (${inToftIn(o3)})`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertIn(value, unitOut) {
  let m = value / 39.37;
  switch (unitOut) {
    case "MM":
      return `${(m * 1000000).toFixed(2)}mm`;
    case "CM":
      return `${(m * 100000).toFixed(2)}cm`;
    case "M":
      return `${m.toFixed(2)}m`;
    case "KM":
      return `${(m / 1000).toFixed(4)}km`;
    case "MI":
      let o1 = value / 5280;
      return `${o1.toFixed(8)}miles`;
    case "FT":
      let o2 = value / 12;
      return `${o2.toFixed(4)}ft (${ftToftIn(o2)})`;
    case "IN":
      return `${value}in (${inToftIn(value)})`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertKg(value, unitOut) {
  switch (unitOut) {
    case "KG":
      return `${value}kg`;
    case "LB":
      let o1 = value * 2.205;
      return `${o1.toFixed(2)}lb`;
    case "OZ":
      let o2 = value * 35.274;
      return `${o2.toFixed(2)}oz`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertLb(value, unitOut) {
  switch (unitOut) {
    case "KG":
      let o1 = value / 2.205;
      return `${o1.toFixed(2)}kg`;
    case "LB":
      return `${value}lb`;
    case "OZ":
      let o2 = value * 16;
      return `${o2.toFixed(2)}oz`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertMl(value, unitOut) {
  switch (unitOut) {
    case "ML":
      return `${value}mL`;
    case "OZ":
      let o2 = value / 29.574;
      return `${o2.toFixed(2)}oz`;
    default:
      return "(No valid conversion found)";
  }
}

/**
 * @param {number} value 
 * @param {string} unitOut
 * @returns {string} formatted output
 */
function convertOz(value, unitOut) {
  switch (unitOut) {
    case "KG":
      let o1 = value / 35.274;
      return `${o1.toFixed(2)}kg`;
    case "LB":
      let o2 = value / 16;
      return `${o2.toFixed(2)}lb`;
    case "ML":
      let o3 = value * 29.574;
      return `${o3.toFixed(2)}mL`;
    case "OZ":
      return `${value}oz`;
    default:
      return "(No valid conversion found)";
  }
}

const unitOptions = [
  { name: 'C',  value: 'C',  type: unitType.Temperature, defaultOutput: 'F', convert: convertC },
  { name: 'F',  value: 'F',  type: unitType.Temperature, defaultOutput: 'C', convert: convertF },
  { name: 'mm', value: 'MM', type: unitType.Distance,    defaultOutput: 'IN', convert: convertMm },
  { name: 'cm', value: 'CM', type: unitType.Distance,    defaultOutput: 'FT', convert: convertCm },
  { name: 'm',  value: 'M',  type: unitType.Distance,    defaultOutput: 'FT', convert: convertM },
  { name: 'km', value: 'KM', type: unitType.Distance,    defaultOutput: 'MI', convert: convertKm },
  { name: 'miles', value: 'MI', type: unitType.Distance, defaultOutput: 'KM', convert: convertMi },
  { name: 'ft', value: 'FT', type: unitType.Distance,    defaultOutput: 'CM', convert: convertFt },
  { name: 'in', value: 'IN', type: unitType.Distance,    defaultOutput: 'CM', convert: convertIn },
  { name: 'kg', value: 'KG', type: unitType.Weight,      defaultOutput: 'LB', convert: convertKg },
  { name: 'lb', value: 'LB', type: unitType.Weight,      defaultOutput: 'KG', convert: convertLb },
  { name: 'mL', value: 'ML', type: unitType.Weight,      defaultOutput: 'OZ', convert: convertMl },
  { name: 'oz', value: 'OZ', type: unitType.Weight,      defaultOutput: 'ML', convert: convertOz }
]

function buildCommand() {
  return new SlashCommandBuilder()
    .setName('convert2')
    .setDescription('Converts between various units')
    .addNumberOption(option =>
      option.setName('value')
        .setDescription('Numerical value of input')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('unit')
        .setDescription('Unit of measurement for input')
        .setRequired(true)
        .addChoices(unitOptions)
    )
    .addStringOption(option =>
      option.setName('unit-out')
        .setDescription('Unit of measurement for output')
        .addChoices(unitOptions)
    )
}

/**
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {Promise<void>}
 */
async function execute(interaction) {
  // parse inputs
  const value = interaction.options.getNumber('value');
  const unitInInput = interaction.options.getString('unit');
  let unitOutInput = interaction.options.getString('unit-out');
  const [unitIn] = unitOptions.filter(option => option.value === unitInInput);
  if (!unitOutInput) {
    unitOutInput = unitIn.defaultOutput;
  }
  const [unitOut] = unitOptions.filter(option => option.value === unitOutInput);

  // validation
  if (!unitIn || !unitOut) {
    await interaction.reply(`could not find valid units for ${unitInInput} | ${unitOutInput}`);
    return;
  }
  if (unitIn.type !== unitOut.type) {
    await interaction.reply(`${unitIn.name} values cannot be converted to ${unitOut.name}`);
    return;
  }

  let output = unitIn.convert(value, unitOut.value);
  interaction.reply(`In development >> ${value}${unitIn.name} -> ${output}`);
}

module.exports = {
  data: buildCommand(),
  execute,
}