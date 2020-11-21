const config = require('./config');

const { WebhookClient } = require('discord.js');

module.exports = async function (data) {
    const hook = new WebhookClient(
        config.loadconfig().hookIDs.log,
        config.loadsecrets().hooks.log
    );
    hook.send(data);
};
