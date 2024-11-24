const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue, useMainPlayer } = require("discord-player");

const subCommands = {
  PLAY: "play",
  SKIP: "skip",
  QUEUE: "queue",
  CLEAR_QUEUE: "clearqueue",
  VOLUME: "volume",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Music handling commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(subCommands.PLAY)
        .setDescription(
          "Play Youtube music in the voice channel you're currently in."
        )
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("URL or title of Youtube video to play.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(subCommands.SKIP)
        .setDescription("Skips the current song.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(subCommands.CLEAR_QUEUE)
        .setDescription("Clear queue of all songs.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(subCommands.VOLUME)
        .setDescription("Modify playback volume.")
        .addIntegerOption((option) =>
          option
            .setName("value")
            .setDescription("Volume level (1-100) that you'd like to set")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(subCommands.QUEUE)
        .setDescription("Display latest music in queue.")
    ),
  async execute(interaction) {
    // let's defer the interaction as things can take time to process
    await interaction.deferReply();
    switch (interaction.options.getSubcommand()) {
      case subCommands.PLAY:
        await play(interaction);
        break;
      case subCommands.SKIP:
        await skip(interaction);
        break;
      case subCommands.CLEAR_QUEUE:
        await clear_queue(interaction);
        break;
      case subCommands.VOLUME:
        await change_volume(interaction);
        break;
      case subCommands.QUEUE:
        await show_queue(interaction);
        break;
      default:
        interaction.reply({
          content: "Command was not called correctly. Try again.",
        });
    }
  },
};

async function play(interaction) {
  const channel = interaction.member.voice.channel;
  if (!channel)
    return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
  const query = interaction.options.getString("query", true); // get url or name

  try {
    const { track } = await useMainPlayer().play(channel, query, {
      requestedBy: interaction.user,
      nodeOptions: {
        // nodeOptions are the options for guild node (aka your queue in simple word)
        metadata: interaction, // we can access this metadata object using queue.metadata later on
        volume: 10,
      },
    });

    return interaction.followUp(`**${track.title}** enqueued!`);
  } catch (e) {
    // let's return error if something failed
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}

async function skip(interaction) {
  const channel = interaction.member.voice.channel;
  if (!channel)
    return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
  try {
    const queue = useQueue(interaction.guild.id);
    const toSkip = queue.currentTrack.title;
    queue.node.skip();
    return interaction.followUp(`**${toSkip}** skipped!`);
  } catch (error) {
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}

async function clear_queue(interaction) {
  const channel = interaction.member.voice.channel;
  if (!channel)
    return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
  try {
    const queue = useQueue(interaction.guild.id);
    queue.delete();
    return interaction.followUp("Queue has been cleared.");
  } catch (error) {
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}

async function change_volume(interaction) {
  const channel = interaction.member.voice.channel;
  if (!channel)
    return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
  const value = interaction.options.getInteger("value", true); // get volume
  if (value < 1 || value > 100) {
    return interaction.followUp("Volume must be a value between 0 and 100.");
  }

  try {
    const queue = useQueue(interaction.guild.id);
    queue.node.setVolume(value); //Pass the value for the volume here
    return interaction.followUp(`Volume set to: ${value}.`);
  } catch (error) {
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}

async function show_queue(interaction) {
  const channel = interaction.member.voice.channel;
  if (!channel)
    return interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
  try {
    const queue = useQueue(interaction.guild.id);
    const tracks = queue.tracks.toArray(); //Converts the queue into a array of tracks
    const message = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Current music queue!`)
      .addFields(
        ...tracks.map((track, index) => {
          return {
            name: `${index + 1}`,
            value: `${track.title}`,
            inline: true,
          };
        })
      );
    return interaction.followUp({ embeds: [message] });
  } catch (error) {
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}
