FROM node:16-alpine as builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn build

FROM builder
WORKDIR /app
COPY --from=builder /app/dist .
COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
RUN yarn install --production=true
CMD yarn start

