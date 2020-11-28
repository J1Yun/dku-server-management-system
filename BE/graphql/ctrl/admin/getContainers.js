const models = require('../../../models');
module.exports = async ({ hostId }) => {
    if (!hostId) return [];
    return await models.server
        .findAll({
            attributes: [
                'id',
                'name',
                'os',
                'cpu',
                'ram',
                'host',
                'port',
                'password',
                'instanceName',
            ],
            where: { hostId },
            raw: true,
        })
        .then((result) => result)
        .catch((error) => error);
};
