const config = require('../utils/config');
const log = require('../utils/log');
const permban = require('../models/permban');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban someone. Mod Only',
    usage: 'ban <member> <reason>',
    async execute(message, args) {
        if (!args[1])
            return await message.channel.send(
                config.loadconfig().messages.notenoughargs
            );
        if (!message.member.permissions.has('BAN_MEMBERS'))
            return await message.channel.send(
                config.loadconfig().messages.unauthorized
            );
        if (!message.mentions.users.first())
            return await message.channel.send(
                ':x: Error 400: You need to mention a user!'
            );

        const member = message.mentions.members.first();

        await new permban({
            type: 'ban',
            offender: member.id,
            moderator: message.author.id,
            reason: args[1],
        }).save();

        await member.ban({ reason: args[1] });

        await message.channel.send(
            `:white_check_mark: Succesfully banned ${member.user.tag}`
        );

        const logembed = new MessageEmbed()
            .setTitle(`${member.displayName} got banned!`)
            .setDescription(
                `${member.user.tag} got permanently banned by ${message.author.tag}`
            )
            .addFields(
                {
                    name: 'Offender:',
                    value: `${member.user.tag} (${member.id})`,
                    inline: true,
                },
                {
                    name: 'Moderator:',
                    value: `${message.author.tag} (${message.author.id})`,
                    inline: true,
                },
                {
                    name: 'Reason:',
                    value: args[1],
                    inline: true,
                }
            )
            .setColor('#D0021B');

        await log(logembed);
    },
};
