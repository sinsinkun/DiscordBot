const fs = require("node:fs");
const path = require("node:path");
const {
  Collection,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const { Player } = require("discord-player");
const { SpotifyExtractor } = require("@discord-player/extractor");
const TwitterScraper = require("./src/passive/twitter-scrape");
const TwitterData = require("./src/common/data/twitter");
const Discord = require("discord.js");
const DiscordUser = require("./src/common/data/user");
const DiscordServer = require("./src/common/data/server");
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

/////// Client setup ///////
client.commands = new Collection();

const foldersPath = path.join(__dirname, "src/commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once("ready", async () => {
  await player.extractors.register(SpotifyExtractor, {});
  await player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor");
  console.log("Ready!");
});

client.login(process.env.BOT_TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    if (interaction.isAutocomplete()) {
      await command.autocomplete(interaction);
    } else await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (TwitterScraper.toggled) {
    try {
      const url = TwitterScraper.getUrlIfAny(message.content);
      if (url) {
        const content = await TwitterScraper.scrapeContent(url);
        const data = new TwitterData(content);
        await message.channel.send(data.ConstructDiscordMessage());
      }
    } catch (error) {
      console.log(error);
      await message.channel.send(
        "Weird twitter link. Check yourself before you wreck yourself. <:zura:540212494434697236>"
      );
    }
  }

  // log emoji usage
  const discordData = await getDiscordData(message);
  await logUsage(message, discordData);
});

async function getDiscordData(message) {
  const user = new DiscordUser(
    message.author.id,
    message.author.username,
    message.guild.name,
    message.guild.id
  );
  const server = new DiscordServer(message.guild.id, message.guild.name);
  if (!(await user.confirmExistence())) {
    await user.create(message);
  }
  if (!(await server.confirmExistence())) {
    await server.create(message);
  }
  return { user, server };
}

async function logUsage(message, discordData) {
  await discordData.user.logEmojiUsage(message);
  await discordData.user.logStickerUsage(message);
  await discordData.server.logEmojiUsage(message);
  await discordData.server.logStickerUsage(message);
}

/////// Player Setup ///////

const player = new Player(client, {
  skipFFmpeg: true,
  ytdlOptions: {
    filter: "audioonly",
    quality: "highestaudio",
  },
});

// this event is emitted whenever discord-player starts to play a track
player.events.on("playerStart", (queue, track) => {
  // we will later define queue.metadata object while creating the queue
  try {
    const message = new EmbedBuilder()
      .setTitle(track.title)
      .setAuthor({ name: track.author })
      .setThumbnail(track.thumbnail)
      .setFields([
        {
          name: "Duration",
          value: track.duration,
          inline: true,
        },
        {
          name: "Requested by",
          value: track.requestedBy.username,
          inline: true,
        },
      ])
      .setURL(track.url);
    queue.metadata.channel.send({ embeds: [message] });
  } catch (error) {
    queue.metadata.channel.send(`Error: ${error}`);
  }
});
