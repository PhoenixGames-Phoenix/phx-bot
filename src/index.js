const discord = require('discord.js');
const fs = require('fs');
const config = require('./config.js');

const client = new discord.Client();
client.commands = new discord.Collection();

const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`${client.user.tag}`)
});

client.on('message', msg => {
    if (!msg.content.startsWith(config.loadconfig().prefix) || msg.author.bot) return;

    const args = msg.content.slice(config.loadconfig().prefix.length).trim().split(' ');
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return msg.reply(config.loadconfig().messages.unknwoncommand);

    const command = client.commands.get(commandName);

    try {
        command.execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply(config.loadconfig().messages.commanderror);
    }
});

client.login(config.loadsecrets().DiscordToken);

