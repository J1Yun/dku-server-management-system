const { getHostStatusFromRedis, getContainerStatusFromRedis } = require('../../../ssh/tools');

module.exports = {
    getHostStatus: () => getHostStatusFromRedis(),
    getContainerStatus: () => getContainerStatusFromRedis(),
};
