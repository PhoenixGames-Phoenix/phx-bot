const config = require('../utils/config');
const log = require('../utils/log');
const permmute = require('../models/permmute');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'mute',
    description: 'Mute someone. Mod Only',
    usage: 'mute <member> <reason>',
    async execute(message, args) {
        if (!args[1])
            return await message.channel.send(
                config.loadconfig().messages.notenoughargs
            );
        if (!message.member.permissions.has('KICK_MEMBERS'))
            return await message.channel.send(
                config.loadconfig().messages.unauthorized
            );
        if (!message.mentions.users.first())
            return await message.channel.send(
                ':x: Error 400: You need to mention a user!'
            );

        const member = message.mentions.members.first();

        await new permmute({
            type: 'mute',
            offender: member.id,
            moderator: message.author.id,
            reason: args[1],
            active: true,
        }).save();

        let role = await message.guild.roles.cache.find(
            (role) => role.id == config.loadconfig().roles.MUTED
        );
        await member.roles.add(role);

        await message.channel.send(
            `:white_check_mark: Succesfully muted ${member.user.tag}`
        );

        const logembed = new MessageEmbed()
            .setTitle(`${member.displayName} got muted!`)
            .setDescription(
                `${member.user.tag} got permanently muted by ${message.author.tag}`
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
