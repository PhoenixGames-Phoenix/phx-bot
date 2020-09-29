var discord = require('discord.js');
const {config} = require('./config.js');

module.exports = {
    name: 'config',
    description: 'Sets or gets the config, Bot owner only',
    async execute(message, args) {
        if (message.author.tag != config.botowner.toString()) return await message.channel.send(config.messages.unauthorized);
        if (!args[1]) return await message.channel.send(config.messages.notenoughargs);

        if (args[0] == 'get') {
            
        } else if (args[0] == 'set') {

        }
    }
}