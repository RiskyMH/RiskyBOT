# RiskyBOT (code for it)

The code for my bot and some other fun stuff with @discordjs  

This bot uses slash commands (some buttons, and context menu)

## Running

This bot is run by:

* `yarn install` (installing dependencies)
* adding your token to [`.env`](.env) (using [`example.env`](example.env))
* Optional: changing things, see [below](#how-to-configure) for some examples
* `yarn deployCommands` (deploying the application commands)
* `yarn build` (building the `ts` files)
* `yarn start` (finally running it)

NOTE: this uses yarn, so you need to have [yarn](https://yarnpkg.com/getting-started/install) installed


### Hosting online

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/3bvOGj?referralCode=4kwikB)

You can use Railway to host your bot (note you will still have to deploy commands locally). But anything will work.


### Running locally

It is slightly harder to run locally, because it uses HTTP endpoint. Currently I use [Cloudflared Tunnel](https://blog.cloudflare.com/tunnel-for-everyone/) and put the url into Discord's dashboard.

## FAQ

* Q: There are no commands on the Discord app
* A: you need to `deployCommands` otherwise it won't work

## How to configure

### Using [`config.yml`](./config.yml)

You can currently use this file to change some UI settings (eg. colors)

The available features are in the file by default

### Using [`.env`](./.env)

As with [`config.yml`](./config.yml) the file [`example.env`](./example.env) has the necessary options - copy `example.env` to `.env` and put in your discord key

### *`Next few are more technical`*

### Using [`src/main.mts`](./src/main.mts) (Actually modifying the files)

You can do changes to bot by going into the `.mts` or `.ts` or `.js` files and changing stuff

### Using [`packages/*`](./packages) (Actually modifying the files)

**APIs**: these are for commands to use mainly\
**Commands**: these the responses for application commands - also has the command builder
**Utils**: these are for everything's help

NOTE: if you change anything in those above you must run `yarn build` to update the files

NOTE 2: if changing the commands, you need to `deployCommands`, and update [`main.mts`](./src/main.mts) if changing major names


### Things that have a high likely chance of being accepted in a PR

* Translations
* Changing the code (not too much)
* Basically anything else will be looked at

## My hosted bot

For more information see <http://RiskyMH.github.io/RiskyBOT/docs/about/>  

Everything in my GitHub Pages site is mainly for my instance of the bot, but it can be used for other things

Quick links:

* Bot invite: [https://discord.com/...](https://discord.com/api/oauth2/authorize?client_id=780657028695326720&scope=applications.commands)
* Bot Server: <https://discord.gg/BanFeVWyFP>
