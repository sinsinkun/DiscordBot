const { EmbedBuilder, AttachmentBuilder } = require('discord.js');

class TwitterData {
    constructor(scrapedContent) {
        this.title = scrapedContent.title;
        this.description = scrapedContent.description || null;
        this.content = ConstructContent(scrapedContent.video || scrapedContent.image);
        this.url = scrapedContent.url;
    }

    /**
     * Constructs a discord embed message with the attached files of videos or images, depending on twitter data scraped.
     * Return object can be used directly in a channel.send() discord function.
     */
    ConstructDiscordMessage() {
        const files = this.content.map(x => { return new AttachmentBuilder().setFile(x)});
        return {files, embeds: [new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(this.title)
            .setURL(this.url.split('/').slice(0, 4).join('/'))
            .setDescription(this.description)]
        };
    }
}

function ConstructContent(url) {
    if (url.includes('mosaic')) {
        return pullImagesFromMosaic(url);
    } else return [url];
}

/**
 * Pulls image IDs from a twitter mosaic URL and converts them to their twimg url, returning an array of urls.
 * @param {string} url 
 * @returns {[string]}
 */
function pullImagesFromMosaic(url) {
    // Split URL to extract image ids from mosaic URL.
    const split = url.split('/');
    // Get only the image ids.
    const ids = split.slice(5,split.length);
    return ids.map(id => { return `https://pbs.twimg.com/media/${id}.jpg`});
}

module.exports = TwitterData;