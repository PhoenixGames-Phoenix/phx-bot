var discord = require('discord.js');
const {config} = require('../config.js');

module.exports = {
    name: 'ping',
    description: 'Displays the current delay between the bot and the API',
    async execute(message, args) {
        await message.channel.send(`Current Delay: ${message.client.ws.ping}ms :hourglass:`);
    }
}