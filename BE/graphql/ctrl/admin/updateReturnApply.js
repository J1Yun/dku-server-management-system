const models = require('../../../models');
module.exports = async ({ id, applyOk }) => {
    return await models.return
        .update(
            {
                applyOk,
            },
            { where: { id } },
        )
        .then(() => parseInt(id))
        .catch((err) => err);
};
