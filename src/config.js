var fs = require('fs');

module.exports = {
    config: JSON.parse(fs.readFileSync("./config/config.json")),
    secrets: JSON.parse(fs.readFileSync("./config/secrets.json"))
}