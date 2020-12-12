const discord = require('discord.js');
const fs = require('fs');
const config = require('./utils/config.js');
const tempmute = require('./models/tempmute.js');
const log = require('./utils/log');
const ms = require('ms');
const tempban = require('./models/tempban.js');

const client = new discord.Client();
client.commands = new discord.Collection();

const commandFiles = fs
    .readdirSync('./src/commands/')
    .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await client.user.setActivity(
        'https://github.com/PhoenixGames-Phoenix/phx-bot',
        {
            type: 'WATCHING',
        }
    );
    const mutetimers = [];
    var i = 0;
    for await (const doc of tempmute.find({ punishmenttype: 'tempmute' })) {
        const docject = doc.toObject();
        const guild = client.guilds.cache.get(
            await config.loadconfig().GuildID
        );
        const member = guild.members.cache.get(docject.offender);
        const role = guild.roles.cache.find(
            (role) => role.id == config.loadconfig().roles.MUTED
        );
        const moderator = guild.members.cache.get(docject.moderator);
        if (docject.duration.endTime > Date.now()) {
            mutetimers[i] = setTimeout(async function () {
                await member.roles.remove(role);
                const unmuteembed = new discord.MessageEmbed()
                    .setTitle(`${member}'s tempmute expired!`)
                    .setDescription(
                        `${member}'s tempmute expired after ${ms(
                            Date.now() - docject.duration.startTime
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
                            value: moderator.user.tag,
                            inline: true,
                        },
                        {
                            name: 'Reason: ',
                            value: docject.reason,
                            inline: true,
                        },
                        {
                            name: 'Duration: ',
                            value: ms(
                                docject.duration.endTime -
                                    docject.duration.startTime
                            ),
                        }
                    );
                await log(unmuteembed);
                await tempmute.deleteOne({
                    punishmenttype: 'tempmute',
                    offender: member.id,
                });
            }, docject.duration.endTime - Date.now());
            i++;
        } else {
            const unmutembed = new discord.MessageEmbed()
                .setTitle(`${member}'s tempmute expired!`)
                .setDescription(
                    `${member}'s tempmute expired after ${ms(
                        Date.now() - docject.duration.startTime
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
                        value: moderator.user.tag,
                        inline: true,
                    },
                    {
                        name: 'Reason: ',
                        value: docject.reason,
                        inline: true,
                    },
                    {
                        name: 'Duration: ',
                        value: ms(
                            docject.duration.endTime -
                                docject.duration.startTime
                        ),
                    }
                );
            await log(unmutembed);
            await tempmute.deleteOne({
                punishmenttype: 'tempmute',
                offender: member.id,
            });
            await member.roles.remove(role);
        }
    }
    i = 0;
    const bantimers = [];
    for await (const doc of tempban.find({ punishmenttype: 'tempban' })) {
        const docject = doc.toObject();
        const guild = client.guilds.cache.get(
            await config.loadconfig().GuildID
        );
        const user = client.users.cache.get(docject.offender);
        const moderator = client.users.cache.get(docject.moderator);
        if (docject.duration.endTime > Date.now()) {
            bantimers[i] = setTimeout(async function () {
                await tempban.deleteOne({
                    punishmenttype: 'tempban',
                    offender: user.id,
                });
                await guild.members.unban(docject.offender, 'Tempban expired!');
                const unbanembed = new discord.MessageEmbed()
                    .setTitle(`${user.tag}'s tempban expired`)
                    .setDescription(
                        `${user.tag}'s tempban expired after ${ms(
                            Date.now() - docject.duration.startTime
                        )}`
                    )
                    .addFields(
                        {
                            name: 'Offender: ',
                            value: user.tag,
                            inline: true,
                        },
                        {
                            name: 'Moderator: ',
                            value: moderator.tag,
                            inline: true,
                        },
                        {
                            name: 'Reason: ',
                            value: docject.reason,
                            inline: true,
                        },
                        {
                            name: 'Duration:',
                            value: ms(
                                docject.duration.endTime -
                                    docject.duration.startTime
                            ),
                        }
                    );
                await log(unbanembed);
            }, docject.duration.endTime - Date.now());
            i++;
        } else {
            await tempban.deleteOne({
                punishmenttype: 'tempban',
                offender: user.id,
            });
            await guild.members.unban(docject.offender, 'Tempban expired!');
            const unbanembed = new discord.MessageEmbed()
                .setTitle(`${user.tag}'s tempban expired`)
                .setDescription(
                    `${user.tag}'s tempban expired after ${ms(
                        Date.now() - docject.duration.startTime
                    )}`
                )
                .addFields(
                    {
                        name: 'Offender: ',
                        value: user.tag,
                        inline: true,
                    },
                    {
                        name: 'Moderator: ',
                        value: moderator.tag,
                        inline: true,
                    },
                    {
                        name: 'Reason: ',
                        value: docject.reason,
                        inline: true,
                    },
                    {
                        name: 'Duration:',
                        value: ms(
                            docject.duration.endTime -
                                docject.duration.startTime
                        ),
                    }
                );
            await log(unbanembed);
        }
    }
    module.exports.mutetimers = mutetimers;
    module.exports.bantimers = bantimers;
});

client.on('message', (msg) => {
    if (!msg.content.startsWith(config.loadconfig().prefix) || msg.author.bot)
        return;

    const args = msg.content
        .slice(config.loadconfig().prefix.length)
        .trim()
        .split(' ');
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName))
        return msg.reply(config.loadconfig().messages.unknwoncommand);

    const command = client.commands.get(commandName);

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.channel.send(config.loadconfig().messages.commanderror);
    }
});

client.login(config.loadsecrets().DiscordToken);
