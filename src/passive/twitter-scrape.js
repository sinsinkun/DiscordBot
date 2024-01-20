const ogs = require('open-graph-scraper');

const regExp = /((http|https):){0,1}\/\/(www\.){0,1}(twitter|x)\.com\/(?<user>[a-z0-9_-]+)\/(status(es){0,1})\/(?<id>[\d]+)/i;
var toggled = false;

/**
 * @typedef {Object} ScrapedContent
 * @property {boolean} success - Was the request successful
 * @property {string} title - Title of the scraped content
 * @property {string} description - Description tag of the scraped content
 * @property {string} image - Image URL if available on content
 * @property {string} video - Video URL if available on content
 * @property {string} url - URL of the scraped content
 */

/**
 * Scrapes content from twitter.com or x.com url using open-graph-scraper.
 * @param {string} url 
 * @returns {ScrapedContent}
 */
async function scrapeContent(url) {
    const userAgent = 'DiscourseBot/1.0';
    const options = {
        url,
        fetchOptions: { headers: { 'user-agent': userAgent } }
    };
    const response = await ogs(options);
    return {
        success: !response.error,
        title: response.result.ogTitle,
        description: response.result.ogDescription,
        image: response.result.ogImage?.[0].url,
        video: response.result.ogVideo?.[0].url,
        url: response.result.ogUrl
    };
}

/**
 * Uses regex to detect twitter.com or x.com URL in message. Returns the fxtwitter equivalent URL.
 * @param {string} url 
 * @returns {string}
 */
function getUrlIfAny(url) {
    const content = regExp.exec(url);
    return content?.[0].replace(/(x.com|twitter.com)/, 'fxtwitter.com');
}

module.exports = { scrapeContent, getUrlIfAny, toggled };