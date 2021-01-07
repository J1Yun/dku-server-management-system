dockerize -wait tcp://db:3306 -timeout 20s
yarn init-before-start && yarn link-pm2 && yarn start