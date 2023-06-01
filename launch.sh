# important: must be launched from source, not bash

echo "Adding env variables..."
source add_env.sh

echo "Launching bot-chan..."
npm run deploy-commands
wait

echo "Godspeed o7"
