const { MessageEmbed } = require("discord.js");
const hypixel = require("hypixel-api");
const config = require("../config.js").loadconfig();
const secrets = require("../config.js").loadsecrets();

const APIclient = new hypixel(secrets.HypixelToken);

module.exports = {
	name: "bprice",
	description: "Displays the Bazaar price of a given item",
	usage: "bprice <item>",
	async execute(message, args) {
		if (!args[0]) return await message.channel.send(config.notenoughargs);
		try {
			const Bazaar = await APIclient.getSkyblockBazaar();
			//In theory: Bazaar.products.${Product}
			var item = Object.values(Bazaar.products).find(
				(x) => x.product_id == args[0].toUpperCase()
			);
			var itemembed = new MessageEmbed()
				.setColor("#a2eeef")
				.setTitle(`Bazaar Info for ${args[0].toUpperCase()}`)
				.addFields(
					{
						name: "Sell Info",
						// prettier-ignore
						value: `**Sell Price**\n${Number(item.quick_status.sellPrice).toFixed(1)}\n\n**Sell Volume**\n${item.quick_status.sellVolume}\n\n**Sell Offers**\n${item.quick_status.sellOrders}`,
						inline: true,
					},
					{
						name: "Buy Info",
						//prettier-ignore
						value: `**Buy Price** \n${Number(item.quick_status.buyPrice).toFixed(1)} \n\n**Buy Volume** \n${item.quick_status.buyVolume} \n\n**Buy Orders** \n${item.quick_status.buyOrders}`,
						inline: true,
					}
				);

			return await message.channel.send(itemembed);
		} catch (error) {
			console.log(error);
			return await message.channel.send(`:x: Error 404: Item not found!`);
		}
	},
};
