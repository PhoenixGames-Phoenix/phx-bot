module.exports = {
    name: 'ping',
    description: 'Displays the current delay between the bot and the API',
    async execute(message) {
        await message.channel.send(
            `Current Delay: ${message.client.ws.ping}ms :hourglass:`
        );
    },
};
