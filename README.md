# DiscordBot

Custom discord bot with a random assortment of useful commands

Intended to be deployed on the cloud, using an Ubuntu 20.02 server

### Dependencies
- Node ^17.0.0
- NPM ^6.0.0
- Personal AWS account (for dynamoDB)

### Deployment
Server requirements include:
- package manager (brew/snap)
- tmux (persistent session for SSH)
- text editor (nano, vim)
- nodeJS + npm

required environment variables:
```
AWS_ACCESS_KEY_ID=
AWS_DEFAULT_REGION=
AWS_SECRET_ACCESS_KEY=
BOT_TOKEN=
SERVER_TABLE_NAME=
TABLE_NAME=
GUILD_ID=
APPLICATION_ID=
```
environmental variables need to be added to tmux session by running `. add_env.sh`

node packages need to be installed via `npm install`

commands will be updated to discord via `npm run deploy-commands`

and finally server can be launched via `node index.js`
