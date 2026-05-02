FROM node:20-alpine

WORKDIR /app

# 의존성 먼저 복사 (캐시 레이어 활용)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 소스 복사
COPY src/ ./src/

EXPOSE 4000

CMD ["node", "src/index.js"]
