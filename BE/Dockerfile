# Bind to build_n_run.sh in current directory

FROM node:12
RUN apt-get update;
RUN apt install yarn -y
RUN npm install -g pm2
COPY package.json /src/package.json
RUN  cd /src; yarn install;
COPY . /src
EXPOSE 3000 80 443
WORKDIR /src

CMD yarn start