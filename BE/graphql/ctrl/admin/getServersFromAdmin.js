const models = require('../../../models');
module.exports = async () => {
    return await models.server
        .findAll({
            attributes: ['id', 'name', 'os', 'cpu', 'ram', 'location'],
            raw: true,
        })
        .then((result) => result)
        .catch((err) => err);
};
