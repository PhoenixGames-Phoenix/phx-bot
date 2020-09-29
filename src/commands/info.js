var discord = require('discord.js');

module.exports = {
    name: 'info',
    description: 'Displays Info about the bot',
    async execute(message, args) {
        const response = new discord.MessageEmbed()
            .setColor('#cc9900')
            .setTitle('**Bot Info**')
            .setURL('https://PhoenixGames-Phoenix.github.io/#/projects')
            .addField('The Bot is still in the Beta!','The bot is still in the beta and will be usable after it reaches v1.');

        await message.channel.send(response);
    }
}