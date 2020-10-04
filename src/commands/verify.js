const hypixel = require('hypixel-api');
const secrets = require('../config.js').loadsecrets();
const config = require('../config.js').loadconfig();

const APIclient = new hypixel(secrets.HypixelToken);

module.exports = {
    name: 'verify',
    description: 'Verifies that the executed user is the Minecraft user provided and gives him the corresponding roles',
    usage: 'verify <Username>',
    async execute(message, args) {
        if (!args[0]) return await message.channel.send(config.messages.notenoughargs);
        await message.react("⌛");
        try {
            let player = await APIclient.getPlayer('name',args[0]);
            
            if(!player.player.socialMedia) return await message.channel.send(`You havent set your Hypixel Discord Name yet! Please set it to ${message.author.tag}!`);
            if(!player.player.socialMedia.links) return await message.channel.send(`You havent set your Hypixel Discord Name yet! Please set it to ${message.author.tag}!`);
            if(!player.player.socialMedia.links.DISCORD) return await message.channel.send(`You havent set your Hypixel Discord Name yet! Please set it to ${message.author.tag}!`);
            if(player.player.socialMedia.links.DISCORD !== message.author.tag) return await message.channel.send(`You haven't set your Hypixel Discord Name to ${message.author.tag}!`);

            var rank = '';
            if(player.player.rank) {
                rank = player.player.rank;
            } else if (player.player.monthlyPackageRank && player.player.monthlyPackageRank !== "NONE") {
                rank = 'MVP_PLUS_PLUS';
            } else if (player.player.newPackageRank) {
                rank = player.player.newPackageRank;
            } else {
                rank = 'REGULAR';
            }
            let role_id = config.rank_links[rank];
            const role = message.guild.roles.cache.find(obj => obj.id == role_id);
            const roles = message.member.roles;
            if(roles.cache.some(rle => rle.id == role_id)){
                await message.reactions.removeAll();
                return await message.channel.send(`You're already verified and there have been no rank changes`);
            } 
            if(!roles.cache.some(rle => rle.id == role_id)) {
                await message.member.roles.add(role, 'Player verification');
                await message.reactions.removeAll();
                await message.react('✅');
                return await message.channel.send("You've been successfully verified!")
            }

        } catch (error) {
            await message.reactions.removeAll();
            await message.react('❌');
            return await message.channel.send(`:x: Error 404: Player '${args[0]}' not found!`);
        }
    } 
}