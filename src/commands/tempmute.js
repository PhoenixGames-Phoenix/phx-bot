const config = require('../utils/config');
const ms = require('ms');
const tempmute = require('../models/tempmute');
const { MessageEmbed } = require('discord.js');
const log = require('../utils/log');

module.exports = {
    name: 'tempmute',
    description: 'Temporarily ',
    usage: 'tempmute <member> <time> <reason>',
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
                `:x: Error 405: Invalid time format!`
            );
        var time = ms(args[1]);
        if (time < 0)
            return await message.channel.send(
                `:x: Error 425: Cannot mute for a negative amount of time!`
            );
        if (!message.mentions.members.first())
            return await message.channel.send(
                `:x: Error 404: User does not exist!`
            );
        let muteend = Date.now() + time;

        let role = await message.guild.roles.cache.find(
            (role) => role.id == config.loadconfig().roles.MUTED
        );
        let member = await message.mentions.members.first();

        await member.roles.add(role);

        await new tempmute({
            punishmenttype: 'tempmute',
            offender: member.id,
            moderator: message.author.id,
            reason: args[2],
            duration: {
                startTime: Date.now(),
                endTime: muteend,
            },
        }).save();

        const logembed = new MessageEmbed()
            .setTitle(`${member} got tempmuted!`)
            .setDescription(`${member} got tempmuted for ${args[1]}`)
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
                    value: args[1],
                }
            );

        await log(logembed);

        const oldtime = Date.now();
        setTimeout(async function () {
            await tempmute.deleteOne({
                punishmenttype: 'tempmute',
                offender: member.id,
            });
            await member.roles.remove(role);
            const unbanembed = new MessageEmbed()
                .setTitle(`${member}'s tempmute expired!`)
                .setDescription(
                    `${member}'s tempmute expired after ${ms(
                        Date.now() - oldtime
                    )}`
                )
                .addFields(
                    {
                        name: 'Offender: ',
                        value: member.user.tag,
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
        }, time);
        await message.channel.send(
            `:white_check_mark: Succesfully muted ${member.user.tag} for ${args[1]}`
        );
    },
};
