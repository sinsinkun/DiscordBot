FROM node:22.11
RUN apt-get update || : && apt install python-is-python3
RUN apt-get install g++
RUN add-apt-repository ppa:savoury1/ffmpeg4 && apt-get update
RUN apt-get install ffmpeg
WORKDIR /app
COPY . .
RUN npm install --force
CMD ["node", "index.js"]
EXPOSE 3000