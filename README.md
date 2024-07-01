<h1 align="center">
  <img src="https://bot.riskymh.dev/robot.png" alt="RiskyBOT Logo" width="84">
  <br>
  RiskyBOT
</h1>

<p align="center">A random discord bot with many fun features</p>

## Getting Started

This repo contains the code for RiskyBOT and some more specific bots (image generate)

### Installing the dependencies

```sh
yarn install
```

### Configuring the env vars

If you are developing locally, you need to create `.env` files in both the `apps/web` and `apps/bot` folder. Refer to the table below for all the env vars in the project

#### Project: `apps/riskybot`

| Name                                 | Description                                                              | Main Bot? | Deploy Commands? |
| ------------------------------------ | ------------------------------------------------------------------------ | --------- | ---------------- |
| `RISKYBOT_APPLICATION_PUBLIC_KEY`    | The Discord public key for the bot                                       | ✔️        |                  |
| `RISKYBOT_APPLICATION_CLIENT_SECRET` | The Discord client secret for the bot                                    |           | ✔️               |
| `RISKYBOT_APPLICATION_ID`            | The ID of the bot                                                        |           | ✔️               |
| `OWNER_GUILD_ID`                     | The ID of the Discord server to register owner only commands (i.e. eval) |           | ❔               |
| `OWNER_USER_ID`                      | The ID of the user that is the owner (to only allow them to use it)      | ❔        |                  |
| `TOPGG_TOKEN`                        | The Top.gg token (requires a bot on their website)                       | ❔        | ❔               |
| `ERROR_WEBHOOK`                      | The webhook URL to send errors if they occur (not recommended in dev)    | ❔        |                  |

> **Note**: ✔️ (tick) means that it is required and ❔ (question mark) means that it is optional but used. 

#### Project: `apps/imgen`

| Name                              | Description                                                              | Main Bot? | Deploy Commands? |
| --------------------------------- | ------------------------------------------------------------------------ | --------- | ---------------- |
| `IMGEN_APPLICATION_PUBLIC_KEY`    | The Discord public key for the bot                                       | ✔️        |                  |
| `IMGEN_APPLICATION_CLIENT_SECRET` | The Discord client secret for the bot                                    |           | ✔️               |
| `IMGEN_APPLICATION_ID`            | The ID of the bot                                                        |           | ✔️               |
| `ERROR_WEBHOOK`                   | *same as above `ERROR_WEBHOOK`*                                          | ❔        |                 |

> **Note**: ✔️ (tick) means that it is required and ❔ (question mark) means that it is optional but used.

### Running the bots

To run both the `RiskyBOT` and `Image Generate` projects at the same time, use the following command:

```sh
yarn vercel dev
```

> **Note**: You you will have to create a vercel account for this project and make suer to set the root directory as `apps/bot`

#### Running the bots individually

You can choose to run one of these following commands to run a singular bot (note that it if the bot crashes so does the program):

```sh
yarn run start:riskybot
yarn run start:imgen
```

### Registering Discord commands

To use the context and slash commands you first need to register them in Discord. The easiest way to do that is by running both of these commands:

```sh
yarn run deploy-commands:riskybot
yarn run deploy-commands:imgen
```

Notice how there are multiple commands, this is because you only need to do the one that has had commands changed.

## My hosted bot

For more information see <https://bot.riskymh.dev/>  

Quick links:

* Bot Invite: <https://discord.com/oauth2/authorize?client_id=780657028695326720>
* Bot Server: <https://discord.gg/BanFeVWyFP>
