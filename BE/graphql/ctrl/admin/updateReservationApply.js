const models = require('../../../models');
module.exports = async ({ id, applyOk }) => {
    return await models.reservation
        .update(
            {
                applyOk,
            },
            { where: { id } },
        )
        .then(() => parseInt(id))
        .catch((err) => err);
};
