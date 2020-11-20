const models = require('../../../models');
module.exports = async () => {
    const query =
        'select count(v.id) as confirmWaiting from ( select id as id from reservations where applyOk=0 UNION ALL select id as id from returns where applyOk=0) v';

    return await models.sequelize.query(query).spread(
        (result) => console.log(result),
        (error) => error,
    );
};
