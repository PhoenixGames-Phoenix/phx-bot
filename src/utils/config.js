var fs = require('fs');

module.exports = {
    config: JSON.parse(fs.readFileSync('./config/config.json')),
    secrets: JSON.parse(fs.readFileSync('./config/secrets.json')),
    loadconfig: function loadconfig() {
        return JSON.parse(fs.readFileSync('./config/config.json'));
    },
    loadsecrets: function loadsecret() {
        return JSON.parse(fs.readFileSync('./config/secrets.json'));
    },
};
