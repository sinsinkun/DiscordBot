# DiscordBot

Custom discord bot with a random assortment of useful commands

Intended to be deployed on the cloud, using an Ubuntu 20.02 server

### Dependencies
- Node ^17.0.0
- NPM ^6.0.0

### Deployment
Server requirements include:
- package manager (brew/snap)
- tmux (persistent session for SSH)
- text editor (nano, vim)
- nodeJS + npm

environmental variables need to be added to tmux session by running `. add_env.sh`

node packages need to be installed via `npm install`

commands will be updated to discord via `npm run deploy-commands`

and finally server can be launched via `node index.js`
