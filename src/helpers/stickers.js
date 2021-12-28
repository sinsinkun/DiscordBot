function getCustomStickers(message) {
    let customStickers = message.guild.stickers.cache.map(sticker => {
		return `:${sticker.name}:${sticker.id}`;
	})
	return customStickers;
}

module.exports = { getCustomStickers }