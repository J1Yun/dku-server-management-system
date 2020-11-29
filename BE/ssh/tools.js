const redis = require('redis');
const models = require('../models');
const { promisify } = require('util');
const Client = require('ssh2').Client;
const redisHost = require('../conf/secret').redisHost;
const redisClient = redis.createClient(redisHost);

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
    // Do caching
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
};

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

const connAllContainers = () => {
    return new Promise(async (resolve, reject) => {
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
};

const connAllHosts = () => {
    return new Promise(async (resolve, reject) => {
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
};

const commandToContainerViaHost = (command, containerId) => {
    return new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const targetContainer = servers.containers.filter((c) => c.id === containerId)[0];
        const targetHostInstance = servers.hosts.filter(
            (h) => h.id === targetContainer.define.hostId,
        )[0];
        resolve(
            await commandToHost(targetHostInstance, command, targetContainer.define.instanceName),
        );
    });
};

// docker [command] [instanceName]
const commandToContainerViaHostUsingDocker = (command, containerId) => {
    return new Promise(async (resolve, reject) => {
        const servers = (await getServers()) || reject(Error('Empty servers'));
        const targetContainer = servers.containers.filter((c) => c.id === containerId)[0];
        const targetHostInstance = servers.hosts.filter(
            (h) => h.id === targetContainer.define.hostId,
        )[0];
        resolve(
            await commandToHost(
                targetHostInstance,
                `docker ${command} ${targetContainer.define.instanceName}`,
            ),
        );
    });
};

const setContainerStatusToRedis = async () =>
    redisClient.set(REDIS_CONTAINER_STATUS_NAME, JSON.stringify(await connAllContainers()));

const setHostStatusToRedis = async () =>
    redisClient.set(REDIS_HOST_STATUS_NAME, JSON.stringify(await connAllHosts()));

const getContainerStatusFromRedis = async () =>
    JSON.parse(await getAsync(REDIS_CONTAINER_STATUS_NAME));

const getHostStatusFromRedis = async () => JSON.parse(await getAsync(REDIS_HOST_STATUS_NAME));

module.exports = {
    setContainerStatusToRedis,
    setHostStatusToRedis,
    getContainerStatusFromRedis,
    getHostStatusFromRedis,
    updateServers,
};

//commandToHost(servers.hosts[0], 'docker restart dku-ubuntu-18');
//commandToHost(servers.hosts[0], 'docker restart dku-ubuntu-20');
//commandToHost(servers.hosts[0], 'docker restart dku-centos-8');
