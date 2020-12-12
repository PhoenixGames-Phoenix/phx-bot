const config = require('../utils/config');
const permmute = require('../models/permmute');
const log = require('../utils/log');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Unmutes a muted user',
    usage: 'unmute <member> [<reason>]',
    async execute(message, args) {
        let member = message.mentions.members.first();
        if (!args[0])
            return await message.channel.send(
                config.loadconfig().messages.notenoughargs
            );
        if (!message.member.hasPermission('KICK_MEMBERS'))
            return await message.channel.send(
                config.loadconfig().messages.unauthorized
            );
        if (!message.mentions.members.first())
            return await message.channel.send(
                ':x: Error 400: You need to mention a user!'
            );
        if (
            !(await permmute.exists({
                offender: message.mentions.members.first(),
                active: true,
            }))
        ) {
            return await message.channel.send(
                ':x: Error 405: User is not muted!'
            );
        } else {
            await permmute.deleteOne({
                offender: message.mentions.members.first().id,
            });
            await message.member.roles.remove(
                message.guild.roles.cache.find(
                    (role) => role.id == config.loadconfig().roles.MUTED
                ),
                args[1] || 'No reason specified!'
            );
            const logembed = new MessageEmbed()
                .setTitle(`${member.displayName} got unmuted!`)
                .setDescription(
                    `${member.user.tag} got unmuted by ${message.author.tag}`
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
                        value: args[1] || 'No reason specified!',
                        inline: true,
                    }
                )
                .setColor('#D0021B');

            await log(logembed);

            return await await message.channel.send(
                `:white_check_mark: Successfully unmuted ${
                    message.mentions.members.first().displayName
                }!`
            );
        }
    },
};
