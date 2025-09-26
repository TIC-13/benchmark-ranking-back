FROM node:24

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . .

RUN npx prisma generate

CMD npm run start
