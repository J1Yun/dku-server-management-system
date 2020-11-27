const redis = require('redis');
const { promisify } = require('util');
const Client = require('ssh2').Client;
// 이 servers 부분을 hardcoding 하지말고 redis -> mysql 캐싱
const servers = require('../conf/servers');
const redisHost = require('../conf/secret');
const redisClient = redis.createClient(redisHost);

redisClient.on('error', (err) => {
    console.error(err);
});
redisClient.on('ready', () => {
    console.log('Redis is ready');
});

const getAsync = promisify(redisClient.get).bind(redisClient);

const commandToHost = (instance, command) =>
    new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            conn.exec(command, (error, stream) => {
                if (error) reject(error);
                stream.on('data', (data) => {
                    console.log('STDOUT: ' + data);
                });
                stream.stderr.on('data', (data) => {
                    console.log('STDERR: ' + data);
                });
                stream.on('close', (code, signal) => {
                    console.log('Process closed with code ' + code);
                    resolve(`Executed command to host [${instance.id}] Successfully.`);
                });
            });
        })
            .on('error', (error) => reject(error))
            .connect(instance.connInfo);
    });

const connInstance = (instance) =>
    new Promise((resolve, reject) => {
        const conn = new Client();
        conn.on('ready', () => {
            conn.end();
            resolve(instance.id);
        })
            .on('error', (error) => reject(error))
            .connect(instance.connInfo);
    });

// To Redis
// 사용자가 함수를 호출하는 것이 아닌 redis의 결과값만을 가져옴
const connAllInstance = () => {
    return new Promise(async (resolve, reject) => {
        const connData = [];
        for (const instance of servers.containers) {
            await connInstance(instance)
                .then((id) => connData.push({ id, status: 1 }))
                .catch((error) =>
                    connData.push({
                        id: instance.id,
                        status: 0,
                        error: `${error.code} (${error.errno})`,
                    }),
                );
        }
        resolve(connData);
    });
};

const setInstanceStatusToRedis = async () =>
    redisClient.set('instance-status:all', JSON.stringify(await connAllInstance()));

const getInstanceStatusFromRedis = async () =>
    console.log(JSON.parse(await getAsync('instance-status:all')));

setInstanceStatusToRedis();
getInstanceStatusFromRedis();
//commandToHost(servers.hosts[0], 'docker restart dku-ubuntu-18');
//commandToHost(servers.hosts[0], 'docker restart dku-ubuntu-20');
//commandToHost(servers.hosts[0], 'docker restart dku-centos-8');
