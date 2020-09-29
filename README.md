# phx-bot

The Discord Bot for the PHX Discord server written in nodejs using discord.js
[![CodeFactor](https://www.codefactor.io/repository/github/phoenixgames-phoenix/phx-bot/badge/master)](https://www.codefactor.io/repository/github/phoenixgames-phoenix/phx-bot/overview/master)

## Use of the Bot

I've originally made the bot for private usage on my discord server, but i thought the features i wrote and will write could be useful for the public too.
Note: I will NOT host this bot, as i don't plan to add premium features that could pay the server cost.

## Read before contributing

- If you want a new Feature implemented, but don't know how, try opening a Issue, adding [REQUEST] in the title and adding the request and feature labels
- If you want to add a new feature, add [FEATURE] in the title of the Pull Request and add the feature label
- ***IMPORTANT: IF YOU FIND SOMETHING CRITICAL, LIKE A LEAKED API KEY, PLEASE DONT OPEN AN ISSUE! TRY TO CONTACT ME PRIVATE!***

## Installing & Developing

### Tools

Make sure you have following tools installed:

nodejs v12.18.3
Docker 19.03.13 (optional)

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

in the config.json, you will already have a template cloned, just make sure to change the bot owner to your own username + tag

for the secrets, you will have to create a secrets.json file with this template:

```json
{
    "DiscordToken": "yourdiscordbottokenhere",
    "HypixelToken": "your-hypixel-api-token-here"
}
```

The Hypixel Token currently isn't required, but will be for every future hypixel feature

### Installation

To install all required Dependencies just run

```sh
npm i
```

in the base directory. All dependencies should be installed now. (Let me know if there are any missing, i could have some installed globally)

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
