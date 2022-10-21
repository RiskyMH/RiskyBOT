# RiskyBOT (code for it)

The code for my bot and some other fun stuff with Discord  

This bot uses slash commands (some buttons, and context menu)

## Running on Vercel

### Step 1: Deploying

Click the button below to deploy to Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FRiskyMH%2FRiskyBOT)

When asked for environment variables fill them out:

* `APPLICATION_PUBLIC_KEY`: The Discord application public key for the main bot (required to use `POST /api/riskybot` endpoint)
* `IMGEN_APPLICATION_PUBLIC_KEY`: The Discord application public key for the imgen bot (required to use `POST /api/imgen` endpoint)
* MORE OPTIONAL: 
  * `TOPGG_TOKEN`: The top.gg token (requires a bot listed on Top.gg)
  * `OWNER_ID`: The owner ID (required for Eval command)

### Step 2: Deploying the commands

> Deploying commands when deployed on Vercel:

For main bot commands:

* Option 1: Go to `/api/applicationCommands/deploy?token={YOUR_BOT_TOKEN}&id={YOUR_BOT_ID}`
* Option 2: Go to `/api/applicationCommands/deploy?client_secret={YOUR_OAUTH_SECRET}&id={YOUR_APPLICATION_ID}`


For main bot owner commands:

* Go to `/api/applicationCommands/deployOwnerOnly?{the prev config like above}&guild_id={YOUR_GUILD_ID}`

For imgen bot commands:

* Go to `/api/applicationCommands/deployImgen?{the prev config like above}`

## Running dev locally

* `yarn install` (installing dependencies)
* Optional: changing things, see [below](#how-to-configure) for some examples
* `yarn deployCommands` (deploying the application commands)
  * Requires environment variables to be set
* `yarn vercel dev` (finally running it)

NOTE: this uses yarn, so you need to have [yarn](https://yarnpkg.com/getting-started/install) installed

It is slightly harder to run locally, because it uses HTTP endpoint. Currently I use [Cloudflared Tunnel](https://blog.cloudflare.com/tunnel-for-everyone/) and put the url into Discord's dashboard.

## FAQ

* Q: There are no commands on the Discord app
* A: you need to `deployCommands` otherwise it won't work

## How to configure

### Using [`config.yml`](./config.yml)

You can currently use this file to change some UI settings (eg. colors)

The available features are in the file by default

### Using [`.env`](./.env)

As with [`config.yml`](./config.yml) the file [`example.env`](./example.env) has the necessary options - copy `example.env` to `.env` and put in your discord key. This is only if running locally (i.e. not on Vercel).

### *`Next few are more technical`*

### Using [`src/main.mts`](./src/main.mts) (Actually modifying the files)

You can do changes to bot by going into the `.mts` files and changing stuff

### Using [`packages/*`](./packages) (Actually modifying the files)

**APIs**: these are for commands to use mainly\
**Commands**: these the responses for application commands - also has the command builder
**Utils**: these are for everything's help

NOTE: If changing the commands, you need to `deployCommands`, and update [`main.mts`](./src/main.mts) if changing major names

### Things that have a high likely chance of being accepted in a PR

* Changing the code (not too much)
* Basically anything else will be looked at

## My hosted bot

For more information see <http://RiskyMH.github.io/RiskyBOT/>  

Everything in my GitHub Pages site is mainly for my instance of the bot, but it can be used for other things

Quick links:

* Bot invite: [https://discord.com/...](https://discord.com/api/oauth2/authorize?client_id=780657028695326720&scope=applications.commands)
* Bot Server: <https://discord.gg/BanFeVWyFP>
