FROM node:22.11-alpine
RUN apk add g++ make py3-pip
RUN apk update && apk add ffmpeg
WORKDIR /app
COPY . .
RUN npm install --force
CMD ["node", "index.js"]
EXPOSE 3000