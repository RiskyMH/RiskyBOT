# RiskyBOT (code for it)

The code for my bot and some other fun stuff with @discordjs  

This bot uses slash commands (some buttons, and context menu)

## Running
This bot is run by `yarn start`\
To add the commands run `yarn deployCommands`

NOTE: this uses yarn, so you need to have [yarn](https://classic.yarnpkg.com/lang/en/docs/install) installed

### Running Extra
This bot is run by `yarn start:extra`\
To add the commands run `yarn deployCommands:extra`

*ps. don't use normal and extra at same time*

## FAQ
* Q: What is the Extra file (Riskybot 2)
* A: It is has some extra commands and does stuff with text input (reaction to some words)

* Q: There are no commands on the Discord app
* A: you need to `deployCommands` otherwise it wont work

## How to configure
### Using [`config.yml`](./config.yml)
You can currently use this file to change some UI settings (eg. colures)

The available features are in the file by default

### Using [`.env`](./.env)
As with [`config.yml`](./config.yml) the file [`example.env`](./example.env) has the necessary options - copy `example.env` to `.env` and put in your discord key

This is used for extra config but it is not the best way to be using this - used for extra
### *`Next few are more technical`*
<!-- 
### Using [`src/applicationCommands/commands.json`](./src/applicationCommands/commands.json)
With this (and the [`commandsExtra.json`](src/applicationCommands/commandsExtra.json)) file you can change how the slash commands work \
You can:
- change their description
- remove commands/parts of
- add more (see below) -->

### Using [`src/main.mts`](./src/main.mts) (Actually modifying the files)
You can do changes to bot by going into the `.mts` or `.ts` or `.js` files and changing stuff

### Using [`packages/*`](./packages) (Actually modifying the files)
**APIs**: these are for functions to use mainly   
**Functions**: these the responses for application commands - also has the command builder   
**Utils**: these are for everything's help

NOTE: if you change anything in those above you must run `yarn --force` to update the files

## My hosted bot
For more information see http://RiskyMH.github.io/RiskyBOT/docs/about/  

Everything in my GitHub Pages site is mainly for my instance of the bot, but it can be used for other things

Quick links:
* Bot invite: [link](https://discord.com/api/oauth2/authorize?client_id=780657028695326720&scope=applications.commands)
* Bot Server: https://discord.gg/BanFeVWyFP
