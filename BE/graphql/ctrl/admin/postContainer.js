const models = require('../../../models');
const { updateServers } = require('../../../ssh/tools');

module.exports = async ({ container, hostId }) => {
    const query = `insert into servers (name, os, cpu, ram, location, password, host, port, instanceName, hostId, createdAt, updatedAt) select :name , :os , cpu, ram, location, :password, host, CASE WHEN :os ='Ubuntu 20.04' THEN 11111 WHEN :os ='Ubuntu 18.04' THEN 11100 WHEN :os ='CentOS 8' THEN 10022 END, concat('dku-', replace(SUBSTRING_INDEX(:os,'.',1), ' ', '-')), :hostId , DATE_FORMAT(now(), '%Y-%m-%d %H:%i:%s'), DATE_FORMAT(now(), '%Y-%m-%d %H:%i:%s') from hostservers where id = :hostId;`;
    return await models.sequelize
        .query(query, {
            replacements: {
                ...container,
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
};
