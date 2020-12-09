const redis = require('redis');
const models = require('../models');
const { promisify } = require('util');
const Client = require('ssh2').Client;
const redisHost = require('../conf/secret').redisHost;
const redisClient = redis.createClient(redisHost);
const moment = require('moment');

const REDIS_INSTANCES_NAME = 'instances:all';
const REDIS_HOST_STATUS_NAME = 'host-status:all';
const REDIS_CONTAINER_STATUS_NAME = 'container-status:all';

redisClient.on('error', (error) => {
    console.error(`Error occured at Redis connection, ${error}`);
});
redisClient.on('ready', () => {
    console.log('Redis is ready');
});

const getAsync = promisify(redisClient.get).bind(redisClient);

const refineServersData = (hosts, containers) =>
    new Promise((resolve, reject) => {
        if (!hosts) reject(Error('No hosts specified.'));
        const servers = {
            hosts: [],
            containers: [],
        };
        hosts.forEach((h) =>
            servers.hosts.push({
                id: h.id,
                connInfo: {
                    host: h.host,
                    port: h.port,
                    username: 'root',
                    password: h.password,
                },
            }),
        );
        containers.forEach((c) =>
            servers.containers.push({
                id: c.id,
                define: {
                    os: c.os,
                    hostId: c.hostId,
                    instanceName: c.instanceName,
                },
                connInfo: {
                    host: c.host,
                    port: c.port,
                    username: 'root',
                    password: c.password,
                },
            }),
        );
        resolve(servers);
    });

const getServers = async () => {
    // Get cached data or from MySQL
    const cachedData = JSON.parse(await getAsync(REDIS_INSTANCES_NAME));
    if (!cachedData) {
        const hosts = await models.hostserver.findAll({ raw: true });
        const containers = await models.server.findAll({ raw: true });
        const nonCachedData = await refineServersData(hosts, containers);

        // Do saving cache if not exists
        redisClient.set(REDIS_INSTANCES_NAME, JSON.stringify(nonCachedData));

        return nonCachedData;
    } else return cachedData;
};

const updateServers = async () => {
    const hosts = await models.hostserver.findAll({ raw: true });
    const containers = await models.server.findAll({ raw: true });
    const nonCachedData = await refineServersData(hosts, containers);
    redisClient.set(REDIS_INSTANCES_NAME, JSON.stringify(nonCachedData));
    console.log('Updated Server to redis successfully.');
};

const commandToInstance = (instance, command) =>
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
                    console.log('[CMD] Process closed with code ' + code);
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

const connAllContainers = () =>
    new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
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

const connAllHosts = () =>
    new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const connData = [];
        for (const instance of servers.hosts) {
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

const commandToContainerViaHost = (command, containerId) =>
    new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const targetContainer = servers.containers.find((c) => c.id === parseInt(containerId));
        const targetHostInstance = servers.hosts.find(
            (h) => h.id === targetContainer.define.hostId,
        );
        resolve(
            await commandToInstance(
                targetHostInstance,
                command,
                targetContainer.define.instanceName,
            ),
        );
    });

// docker [command] [instanceName]
const commandToContainerViaHostUsingDocker = (command, containerId) =>
    new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const targetContainer = servers.containers.find((c) => c.id === parseInt(containerId));
        const targetHostInstance = servers.hosts.find(
            (h) => h.id === targetContainer.define.hostId,
        );
        resolve(
            await commandToInstance(
                targetHostInstance,
                `docker ${command} ${targetContainer.define.instanceName}`,
            ),
        );
    });

const commandToContainer = (command, containerId) =>
    new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const targetContainer = servers.containers.find((c) => c.id === parseInt(containerId));
        resolve(await commandToInstance(targetContainer, command));
    });

const commandToHost = (command, hostId) =>
    new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const targetHostInstance = servers.hosts.find((h) => h.id === parseInt(hostId));
        resolve(await commandToInstance(targetHostInstance, command));
    });

const initContainer = (containerId) =>
    new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const targetContainer = servers.containers.find((c) => c.id === parseInt(containerId));
        const targetHostInstance = servers.hosts.find(
            (h) => h.id === targetContainer.define.hostId,
        );
        const dir = `/usr/dku-ssh-server/${targetContainer.define.os.replace(' ', '')}`;
        resolve(await commandToInstance(targetHostInstance, `cd ${dir}; ./clean.sh; ./init.sh;`));
    });

const initEveryContainersAfterUse = async () => {
    const query = `
    select serverId, userId from reservations r where not EXISTS( select serverId, userId from reservations where serverId=r.serverId and userId=r.userId and start=date(now()) and applyOk!=2) and end=DATE_ADD(date(now()), INTERVAL -1 DAY) and applyOk=1;
    `;
    const afterUses = await models.sequelize.query(query).spread(
        (results) => JSON.parse(JSON.stringify(results)),
        (error) => error,
    );
    for (const afterUse of afterUses) {
        await initContainer(afterUse.serverId)
            .then(() => console.log(`[Init-Success] ${afterUse.serverId}`))
            .catch((error) => console.log(`[Init-Fail] ${afterUse.serverId} ${error}`));
    }
    console.log(`[${moment().format('YYYY-MM-DD')}] Init instances completed.`);
};

async function setContainerStatusToRedis() {
    redisClient.set(REDIS_CONTAINER_STATUS_NAME, JSON.stringify(await connAllContainers()));
}

async function setHostStatusToRedis() {
    redisClient.set(REDIS_HOST_STATUS_NAME, JSON.stringify(await connAllHosts()));
}

const getContainerStatusFromRedis = async () =>
    JSON.parse(await getAsync(REDIS_CONTAINER_STATUS_NAME));

const getHostStatusFromRedis = async () => JSON.parse(await getAsync(REDIS_HOST_STATUS_NAME));

const cachingServersToRedis = () => {
    setHostStatusToRedis();
    setContainerStatusToRedis();
    console.log('[Redis] Cached server status.');
};

module.exports = {
    cachingServersToRedis,
    getContainerStatusFromRedis,
    getHostStatusFromRedis,
    updateServers,
    commandToHost,
    commandToContainer,
    commandToContainerViaHost,
    commandToContainerViaHostUsingDocker,
    initContainer,
    initEveryContainersAfterUse,
};
