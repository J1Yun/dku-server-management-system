const models = require('../../../models');
const { updateServers } = require('../../../ssh/tools');

module.exports = async ({ host }) => {
    return await models.hostserver
        .create({ ...host })
        .then((result) => {
            updateServers();
            const data = result.get({ plain: true });
            return {
                id: host.id,
                host: host.host,
                port: host.port,
                name: host.name,
                password: host.password,
                location: host.location,
                cpu: host.cpu,
                ram: host.ram,
            };
        })
        .catch((error) => error);
};
