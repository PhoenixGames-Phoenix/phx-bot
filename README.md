# phx-bot

The Discord Bot for the PHX Discord server written in nodejs using discord.js

![GitHub](https://img.shields.io/github/license/PhoenixGames-Phoenix/phx-bot)
[![CodeFactor](https://www.codefactor.io/repository/github/phoenixgames-phoenix/phx-bot/badge/master)](https://www.codefactor.io/repository/github/phoenixgames-phoenix/phx-bot/overview/master)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/PhoenixGames-Phoenix/phx-bot/ESLint%20CI?label=ESLint&style=for-the-badge)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/PhoenixGames-Phoenix/phx-bot/Docker%20Image%20CI?label=Docker%20Build&style=for-the-badge)

## Use of the Bot

I've originally made the bot for private usage on my discord server, but i thought the features i wrote and will write could be useful for the public too.
Note: I will NOT host this bot, as i don't plan to add premium features that could pay the server cost.

## Installing & Developing

### Tools

Make sure you have following tools installed:

- nodejs 14.15.0 (Pretty much everything between lts and 15, as node 15 changes npm alot)
- MongoDB 4.4.1
- Docker 19.03.13 (optional)

### Cloning

First, clone the repository with

```sh
git clone https://github.com/PhoenixGames-Phoenix/phx-bot.git
```

or with

```sh
gh repo clone PhoenixGames-Phoenix/phx-bot
```

### Config

After you've cloned the repository, you have to edit the config

in the config.json, you will already have a template cloned, just make sure to change everything.

for the secrets, you will have to create a secrets.json file with this template:

```json
{
  "DiscordToken": "yourdiscordbottokenhere",
  "HypixelToken": "your-hypixel-api-token-here",
  "MongoPassword": "ThisIsNotASecurePassword",
  "hooks": {
    "log": "ThisIsTheKeyFromTheURLThatShouldBeVeryLong"
  }
}
```

The Hypixel Token currently isn't required, but will be for every future hypixel feature

### MongoDB config

Here are the things you need to configure to run this bot without changing anything:

- Create a db called 'discord'
- Within this db, create a collection called punishments
- Your MongoDB Server will need to run with authentication enabled, with a user on the 'discord' db with dbAdmin

### Installation

To install all required Dependencies just run

```sh
npm i
```

in the base directory. All dependencies should be installed now.

**IMPORTANT**
This does NOT install MongoDB, you'll still have to install and configure mongoDB as mentioned in #6

### Running and building

If you just want to run it natively on node, run

```sh
node ./src/
```

in the base directory.

To build the image just run

```sh
docker build -t name:tag .
```

To start a container, run

```sh
docker run -d name:tag
```

The -d option is not required. It just detaches the console from the container.

### Development

For Development, just use your Standard IDE or Text editor for nodejs.
I personally use VScode, but every IDE has its positive and negative points, so you should just use the IDE you prefer.
