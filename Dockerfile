FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY index.html style.css app.js ./

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]
