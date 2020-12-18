const models = require('../../../models');
module.exports = async () =>
    await models.server
        .findAll({
            attributes: ['id', 'name', 'os', 'cpu', 'ram', 'location', 'isPhysical'],
            raw: true,
        })
        .then((result) => result)
        .catch((err) => err);
