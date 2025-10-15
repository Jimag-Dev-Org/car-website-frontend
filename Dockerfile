FROM node:20-alpine as deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps as build
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "run", "start"]