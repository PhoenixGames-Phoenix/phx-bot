const { MessageEmbed } = require('discord.js');
const index = require('../index');
const log = require('../utils/log');
const permban = require('../models/permban');
const config = require('../utils/config');
const tempban = require('../models/tempban');
module.exports = {
    name: 'unban',
    description: 'Reverses a permanent ban',
    usage: 'unban <userID> <reason>',
    async execute(message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS'))
            return await message.channel.send(
                config.loadconfig().messages.unauthorized
            );
        if (!args[1])
            return await message.channel.send(
                config.loadconfig().messages.notenoughargs
            );
        if (!Number(args[0]))
            return await message.channel.send(
                `:x: Error 405: Not a valid User ID!`
            );
        if (!message.client.users.fetch(args[0]))
            return await message.channel.send(
                `:x: Error 404: User does not exist!`
            );
        if (
            !(await (await message.guild.fetchBans()).find(
                (user) => user.id == message.client.users.fetch(args[0]).id
            ))
        )
            return await message.channel.send(
                `:x: Error 405: User is not banned`
            );
        if (
            await permban.exists({
                offender: args[0],
                punishmenttype: 'ban',
            })
        ) {
            await permban.deleteOne({
                offender: args[0],
                punishmenttype: 'ban',
            });
        } else {
            index.bantimers.forEach((timer) => {
                if (timer.user.id == args[0]) {
                    clearTimeout(timer.timeout);
                }
            });
            await tempban.deleteOne({
                offender: args[0],
            });
        }
        await message.guild.members.unban(args[0], args[1]);

        const logembed = new MessageEmbed()
            .setTitle(`${args[0]} got unbaned!`)
            .setDescription(`${args[0]} got unbanned by ${message.author.tag}`)
            .addFields(
                {
                    name: 'Offender:',
                    value: `${args[0]}`,
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

        await message.channel.send(
            `:white_check_mark: Succesfully unbanned ${args[0]}!`
        );
    },
};
