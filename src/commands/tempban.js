const ms = require('ms');
const config = require('../utils/config');
const tempban = require('../models/tempban');
const log = require('../utils/log');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'tempban',
    description: 'Temporarily bans a user',
    usage: 'tempban <user> <time> <reason>',
    async execute(message, args) {
        if (!message.member.hasPermission('BAN_MEMBERS'))
            return await message.channel.send(
                config.loadconfig().messages.unauthorized
            );
        if (!args[2])
            return await message.channel.send(
                config.loadconfig().messages.notenoughargs
            );
        if (Number(args[1]) || !ms(args[1]))
            return await message.channel.send(
                `:x: Error 405: Invalid Time Format`
            );
        var time = ms(args[1]);
        if (time < 0)
            return await message.channel.send(
                `:x: Error 425: Cannot ban for a negative amount of time!`
            );
        if (!message.mentions.users.first())
            return await message.channel.send(
                `:x: Error 404: User does not exist!`
            );
        let banend = Date.now() - time;
        let member = await message.mentions.members.first();
        let user = await message.mentions.users.first();
        let guild = await message.guild;

        await member.ban({ reason: args[2] });

        await new tempban({
            punishmenttype: 'tempban',
            offender: user.id,
            moderator: message.author.id,
            reason: args[2],
            duration: {
                startTime: Date.now(),
                endTime: banend,
            },
        }).save();

        const oldtime = Date.now();
        setTimeout(async function () {
            await tempban.deleteOne({
                punishmenttype: 'tempban',
                offender: user.id,
            });
            await guild.members.unban(member.id, 'Tempban expired');
            const unbanembed = new MessageEmbed()
                .setTitle(`${member}'s tempban expired!`)
                .setDescription(
                    `${member}'s tempban expired after ${ms(
                        Date.now() - oldtime
                    )}`
                )
                .addFields(
                    {
                        name: 'Offender: ',
                        value: member.tag,
                        inline: true,
                    },
                    {
                        name: 'Moderator: ',
                        value: message.author.tag,
                        inline: true,
                    },
                    {
                        name: 'Reason: ',
                        value: args[2],
                        inline: true,
                    },
                    {
                        name: 'Duration: ',
                        value: ms(Date.now() - oldtime),
                    }
                );
            await log(unbanembed);
        });
        await message.channel.send(
            `:white_check_mark: Succesfully banned ${user.tag} for ${args[1]}`
        );
    },
};
