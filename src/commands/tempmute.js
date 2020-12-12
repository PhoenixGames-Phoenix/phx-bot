const config = require('../utils/config');
const ms = require('ms');
const tempmute = require('../models/tempmute');

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

        setTimeout(async function () {
            await tempmute.deleteOne({
                punishmenttype: 'tempmute',
                offender: member.id,
            });
            await member.roles.remove(role);
        }, time);
        await message.channel.send(
            `:white_check_mark: Succesfully muted ${member.user.tag} for ${args[1]}`
        );
    },
};
