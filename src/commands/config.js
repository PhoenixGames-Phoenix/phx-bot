var discord = require('discord.js');
var fs = require('fs');
const config = require('../config.js').loadconfig();

module.exports = {
    name: 'config',
    description: 'Sets or gets the config, Bot owner only',
    async execute(message, args) {
        if (message.author.tag != config.botowner.toString()) return await message.channel.send(config.messages.unauthorized);
        if (!args[0]) return await message.channel.send(config.messages.notenoughargs);

        if (args[0] == 'get') {
            return await message.reply('```json\n' + fs.readFileSync('./config/config.json') + '\n```');
        } else if (args[0] == 'set') {
            if (!args[2]) return await message.channel.send(config.messages.notenoughargs);
            try {
                await eval(`config.${args[1].toString()} = "${args[2].toString()}";`);
                fs.writeFileSync('./config/config.json', JSON.stringify(config, null, 2));
                return await message.channel.send(`Sucessfully set ${args[1].toString()} to ${args[2].toString()}!`);
            } catch {
                return await message.channel.send(config.messages.commanderror);
            }
        }
    }
}