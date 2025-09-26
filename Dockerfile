FROM node:24

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate

CMD yarn start
