# RiskyBOT (code for it)

The code for my bot and some other fun stuff with @discordjs  

This bot uses slash commands (some buttons, and context menu)

## Running
This bot is run by `npm start`\
To add the commands run `npm run deployCommands`

### Running Extra
This bot is run by `npm run start:extra`\
To add the commands run `npm run deployCommands:extra`

*ps. don't use normal and extra at same time*

## FAQ
* Q: What is the Extra file (Riskybot 2)
* A: It is has some extra commands and does stuff with text input (reaction to some words)

* Q: There are no commands on the Discord app
* A: you need to `deployCommands` otherwise it wont work

## How to configure
### Using [`config.json`](./config.json)
You can currently use this file to change some UI settings (eg. colures)

The available features are in the file by default

### Using [`.env`](./.env)
As with [`config.json`](./config.json) the file [`example.env`](./example.env) has the necessary options - copy `example.env` to `.env` and put in your discord key

This is used for extra config but it is not the best way to be using this - used for extra

### *`Next few are more technical`*
### Using [`src/deployCommands/commands.json`](./src/deployCommands/commands.json)
With this (and the [`commandsExtra.json`](src/deployCommands/commandsExtra.json)) file you can change how the slash commands work \
You can:
- change their description
- remove commands/parts of
- add more (see below)

### Using [`src/main.js`](./src/main.js) (Actually modifying the files)
You can do changes to bot by going into the `.js` or `.mjs` files and changing stuff

You can change the behavior of commands by changing the code - be aware thet somethings to change also have to be changed in the [commands](./src/applicationCommands) and the [functions](./src/functions)

## My hosted bot
For more information see http://RiskyMH.github.io/RiskyBOT/docs/about/  

Everything in my GitHub Pages site is mainly for my instance of the bot but it can be used for other things

Quick links:
* Bot invite: [link](https://discord.com/api/oauth2/authorize?client_id=780657028695326720&scope=applications.commands)
* Bot Server: https://discord.gg/BanFeVWyFP
