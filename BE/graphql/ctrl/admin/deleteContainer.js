const checkIsSuperAdmin = require('../ssh/postCommandByAdmin');
const models = require('../../../models');
const { updateServers } = require('../../../ssh/tools');
module.exports = async ({ containerId }, { userId }) => {
    const query = 'delete from servers where id=:containerId';

    if ((await checkIsSuperAdmin.checkIsSuperAdmin(userId)) === true) {
        return await models.sequelize
            .query(query, {
                replacements: {
                    containerId,
                },
            })
            .spread(
                () => {
                    updateServers();
                    return true;
                },
                (error) => error,
            );
    } else {
        return new Error('NO PERMISSION');
    }
};
