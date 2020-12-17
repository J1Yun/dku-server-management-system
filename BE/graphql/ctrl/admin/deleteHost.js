const checkIsSuperAdmin = require('../ssh/postCommandByAdmin');
const models = require('../../../models');
const { updateServers } = require('../../../ssh/tools');
module.exports = async ({ hostId }, { userId }) => {
    const queryHost = `delete from hostservers where id=:hostId`;
    const queryContainer = `delete from servers where hostId=:hostId`;

    if ((await checkIsSuperAdmin.checkIsSuperAdmin(userId)) === true) {
        const deleteHost = await models.sequelize
            .query(queryHost, {
                replacements: {
                    hostId,
                },
            })
            .spread(
                () => true,
                (error) => error,
            );
        if (deleteHost === true) {
            return await models.sequelize
                .query(queryContainer, {
                    replacements: {
                        hostId,
                    },
                })
                .spread(
                    () => {
                        updateServers();
                        return true;
                    },
                    (error) => error,
                );
        } else return new Error('DATABASE ERROR');
    } else {
        return new Error('NO PERMISSION');
    }
};
