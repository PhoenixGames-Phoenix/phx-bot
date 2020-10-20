var discord = require("discord.js");
const config = require("../config.js").loadconfig();

module.exports = {
	name: "help",
	description: "Gives info about a given command",
	usage: "help [<command>]",
	cooldown: 5,
	async execute(message, args) {
		const commandmap = [];
		const { commands } = message.client;

		if (!args.length) {
			commandmap.push(commands.map((command) => command.name).join(", "));
			var infoembed = new discord.MessageEmbed()
				.setTitle("**Command List**")
				.setColor("#008672")
				.setFooter(config.messages.embedfooter);

			const FieldData = [];

			for (var command of commands.map((command) => command)) {
				FieldData.push(`**${command.name}**`);
				FieldData.push(
					`Description: ${command.description || "No Description provided!"}`
				);
				FieldData.push(`Usage: ${command.usage || "No usage provided!"}`);
				FieldData.push(`Cooldown: ${command.cooldown || 0} second(s)`);
			}
			infoembed.addField("**Command Info**", `${FieldData.join("\n")}`);
			return await message.channel.send(infoembed);
		} else {
			const name = args[0].toLowerCase();
			const command =
				(await commands.get(name)) ||
				(await commands.find((c) => c.aliases && c.aliases.includes(name)));

			if (!command) {
				var unknwonembed = new discord.MessageEmbed()
					.setTitle("**Unknwon Command**")
					.setColor("#d73a4a")
					.addField(
						`Unknwon Command: ${name}`,
						`Command '${name}' either doesn't exist or doesn't get recognised!`
					)
					.setFooter(config.messages.embedfooter);
				return await message.channel.send(unknwonembed);
			}

			var replembed = new discord.MessageEmbed()
				.setTitle(`**Command Info for ${name}**`)
				.setColor("#008672");

			if (command.description) {
				replembed.addField(`**Description**`, `${command.description}`, true);
			}
			if (command.aliases) {
				replembed.addField(
					`**Aliases**`,
					`${command.aliases.join(", ")}`,
					true
				);
			}
			if (command.usage) {
				replembed.addField(`**Usage:**`, `${command.usage}`, true);
			}

			replembed.addField(
				`**Cooldown**`,
				`${command.cooldown || 0} second(s)`,
				true
			);

			return await message.channel.send(replembed);
		}
	},
};
