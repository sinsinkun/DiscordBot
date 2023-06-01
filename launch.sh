# important: must be launched from source, not bash

echo "Adding env variables..."
source add_env.sh

echo "Updating commands on discord..."
npm run "deploy-commands"
wait

echo "Launching bot-chan..."
node index.js
wait

echo "Godspeed o7"
