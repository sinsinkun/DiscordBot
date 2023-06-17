#!/bin/bash
cd ~/DiscordBot
sudo git checkout master
sudo git pull
result=$( sudo docker images -q discord-bot )
if [[ -n "$result" ]]; then
echo "image exists"
sudo docker rmi -f discord-bot
else
echo "No such image"
fi
echo "delete output file"
echo "build the docker image"
sudo docker build -t discord-bot .
echo "built docker images and proceeding to delete existing container"
result=$( docker ps -q -f name=discord-bot-container )
if [[ $? -eq 0 ]]; then
echo "Container exists"
sudo docker container rm -f discord-bot-container
echo "Deleted the existing docker container"
else
echo "No such container"
fi
echo "Deploying the updated container"
sudo docker run -itd -p 3000:3000 --env-file ~/env --name discord-bot-container --detach discord-bot
echo "Deployed successfully!"