const ogs = require('open-graph-scraper');

const regExp = /((http|https):){0,1}\/\/(www\.){0,1}(twitter|x)\.com\/(?<user>[a-z0-9_-]+)\/(status(es){0,1})\/(?<id>[\d]+)/i

async function scrapeContent(url) {
    const userAgent = 'DiscourseBot/1.0';
    const options = {
        url,
        fetchOptions: { headers: { 'user-agent': userAgent } }
    }
    return await ogs(options);
}

function getUrlIfAny(url) {
    const content = regExp.exec(url);
    return content ? content[0].replace(/(x.com|twitter.com)/, 'fxtwitter.com') : null;
}

function pullImagesFromMosaic(url) {
    // Split URL to extract image ids from mosaic URL.
    const split = url.split('/');
    // Get only the image ids.
    const ids = split.slice(5,split.length);
    return ids.map(id => { return `https://pbs.twimg.com/media/${id}.jpg`});
}

module.exports = { scrapeContent, getUrlIfAny, pullImagesFromMosaic };