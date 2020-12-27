dockerize -wait tcp://db:3306 -timeout 20s
echo "## Start Backend Server ##"
echo "## Attach to container: docker exec dku-sms-backend /bin/bash"
echo "## to start pm2 express server: yarn start"
echo "## to start nodemon dev server: yarn dev"
echo "## to kill node process: yarn kill"
yarn init-server