const {
    commandToHost,
    commandToContainerViaHost,
    commandToContainerViaHostUsingDocker,
    commandToContainer,
    initContainer,
} = require('../../../ssh/tools');
const models = require('../../../models');

const checkIsSuperAdmin = (userId) =>
    new Promise(async (resolve, reject) => {
        await models.user
            .findOne({
                attributes: ['type'],
                where: { userId },
                raw: true,
            })
            .then((result) => (parseInt(result.type) === 2 ? resolve(true) : resolve(false)))
            .catch((error) => reject(error));
    });

module.exports = {
    checkIsSuperAdmin,
    postCmdToHost: async ({ command, hostId }, { userId }) => {
        if ((await checkIsSuperAdmin(userId)) === true) {
            return await commandToHost(command, hostId);
        } else {
            return new Error('NO PERMISSION');
        }
    },
    postCmdToPhysical: async ({ command, containerId }, { userId }) => {
        if ((await checkIsSuperAdmin(userId)) === true) {
            return await commandToContainer(command, containerId);
        } else {
            return new Error('NO PERMISSION');
        }
    },
    postCmdToContainerViaHostUsingDocker: async ({ command, containerId }, { userId }) => {
        if ((await checkIsSuperAdmin(userId)) === true) {
            return await commandToContainerViaHostUsingDocker(command, containerId);
        } else {
            return new Error('NO PERMISSION');
        }
    },
    postInitContainer: async ({ containerId }, { userId }) => {
        if ((await checkIsSuperAdmin(userId)) === true) {
            return await initContainer(containerId);
        } else {
            return new Error('NO PERMISSION');
        }
    },
};
