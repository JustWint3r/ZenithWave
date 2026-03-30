FROM node:20-alpine

RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    ffmpeg \
    curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

COPY package*.json ./
COPY scripts/ ./scripts/

RUN npm install --only=production

RUN node scripts/patch-voice.js

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
