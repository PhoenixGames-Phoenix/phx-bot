var discord = require('discord.js');
var fs = require('fs');
const {config} = require('../config.js');
const info = require('./info.js');

module.exports = {
    name: 'help',
    description: 'Gives info about a given command',
    usage: 'help <command>',
    cooldown: 5,
    async execute(message, args) {
        const commandmap = [];
        const {commands} = message.client;

        if (!args.length) {
            commandmap.push(commands.map(command => command.name).join(', '));
            var infoembed = new discord.MessageEmbed()
                .setTitle('**Command List**')
                .setColor('#008672')
                .addFields(
                    {name: `**List of all Commands:**`, value: `**${commandmap}**\nIf you want more info about these commands, try ${config.prefix}help <command>`}
                )
                .setFooter(config.messages.embedfooter)
            return await message.channel.send(infoembed);
        } else {
            const name = args[0].toLowerCase();
            const command = await commands.get(name) || await commands.find(c => c.aliases && c.aliases.includes(name));

            if(!command) {
                var unknwonembed = new discord.MessageEmbed()
                    .setTitle('**Unknwon Command**')
                    .setColor('#d73a4a')
                    .addField(`Unknwon Command: ${name}`,`Command '${name}' either doesn't exist or doesn't get recognised!`)
                    .setFooter(config.messages.embedfooter);
                return await message.channel.send(unknwonembed);
            }

            var infoembed = new discord.MessageEmbed()
                .setTitle(`**Command Info for ${name}**`)
                .setColor('#008672');
            if (command.description) infoembed.addField(`**Description**`,`${command.description}`,true);
            if (command.aliases) infoembed.addField(`**Aliases**`,`${command.aliases.join(', ')}`, true);
            if (command.usage) infoembed.addField(`**Usage:**`,`${command.usage}`,true);
            infoembed.addField(`**Cooldown**`,`${command.cooldown || 0 } second(s)`,true);

            return await message.channel.send(infoembed);
        }

    }
}