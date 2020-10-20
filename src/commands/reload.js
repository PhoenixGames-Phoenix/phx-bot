const config = require("../config.js").loadconfig();

module.exports = {
	name: "reload",
	description: "Reloads all commands, Bot Owner Only",
	usage: "reload <command>",
	async execute(message, args) {
		if (message.author.tag != config.botowner.toString())
			return await message.channel.send(config.messages.unauthorized);
		if (!args.length)
			return await message.channel.send(config.messages.notenoughargs);
		const commandName = args[0].toLowerCase();
		const command =
			message.client.commands.get(commandName) ||
			message.client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		if (!command)
			return await message.channel.send(config.messages.unknwoncommand);

		delete require.cache[require.resolve(`./${command.name}.js`)];

		try {
			const newCommand = require(`./${command.name}.js`);
			await message.client.commands.set(newCommand.name, newCommand);
			await message.channel.send(`Successfuly reloaded command ${commandName}`);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};
