const config = require('../utils/config');
const permmute = require('../models/permmute');
const log = require('../utils/log');
const { MessageEmbed } = require('discord.js');
const tempmute = require('../models/tempmute');
const index = require('../index');

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
            !message.mentions.members
                .first()
                .roles.cache.some(
                    (role) => role.id == config.loadconfig().roles.MUTED
                )
        ) {
            return await message.channel.send(
                ':x: Error 405: User is not muted!'
            );
        } else {
            if (
                await permmute.exists({
                    offender: message.mentions.members.first().id,
                    punishmenttype: 'mute',
                })
            ) {
                await permmute.deleteOne({
                    offender: message.mentions.members.first().id,
                });
            } else {
                index.mutetimers.forEach((timer) => {
                    if (
                        timer.member.id == message.mentions.members.first().id
                    ) {
                        clearTimeout(timer.timeout);
                    }
                });
                await tempmute.deleteOne({
                    offender: message.mentions.members.first().id,
                });
            }
            await message.mentions.members.first().roles.remove(
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
