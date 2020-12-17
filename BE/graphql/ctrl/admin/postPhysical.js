const models = require('../../../models');
const { updateServers } = require('../../../ssh/tools');

module.exports = async ({ host }) => {
    return await models.server
        .create({ ...host, isPhysical: 1 })
        .then(() => {
            updateServers();
            return {
                id: host.id,
                host: host.host,
                port: host.port,
                name: host.name,
                os: host.os,
                password: host.password,
                location: host.location,
                cpu: host.cpu,
                ram: host.ram,
            };
        })
        .catch((error) => error);
};
