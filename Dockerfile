FROM node:22.11
RUN apt-get update || : && apt-get install python -y
RUN apt-get install g++
RUN apt update && apt upgrade
RUN apt install ffmpeg
WORKDIR /app
COPY . .
RUN npm install --force
CMD ["node", "index.js"]
EXPOSE 3000