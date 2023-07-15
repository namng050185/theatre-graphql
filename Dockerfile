
FROM namng050185/nest-api:base

COPY . .

RUN npm run build

EXPOSE 3000
