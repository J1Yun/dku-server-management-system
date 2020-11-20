const moment = require('moment');
const models = require('../../../models');
module.exports = async ({ serverId }) => {
    const query =
        'select serverId, CASE WHEN start<:today and :today<=end THEN :today WHEN :today <=start and start<=DATE_ADD(:today, INTERVAL 2 MONTH) THEN start END as start, CASE WHEN :today <=end and end<=DATE_ADD(:today, INTERVAL 2 MONTH) THEN end WHEN start<=DATE_ADD(:today, INTERVAL 2 MONTH) and DATE_ADD(:today, INTERVAL 2 MONTH)<end THEN DATE_ADD(:today, INTERVAL 2 MONTH) END as end from reservations where serverId=:serverId and applyOk!=2 and end>=:today';
    return await models.sequelize
        .query(query, { replacements: { serverId, today: moment().format('YYYY-MM-DD') } })
        .spread(
            (results) => JSON.parse(JSON.stringify(results)),
            (error) => error,
        );
};
