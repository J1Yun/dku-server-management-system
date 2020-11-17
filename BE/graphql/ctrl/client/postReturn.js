// type Reservation {
//     id: ID!
//     serverId: ID!
//     start: Date
//     end: Date
//     purpose: String
//     applyOk: String
//     createdAt: Date
// }
// postReturn(myReturn: ReturnInput!): ID

const models = require('../../../models');
module.exports = async ({ myReturn }, { userId }) => {
    return await models.return
        .create({
            ...myReturn,
        })
        .then((result) => result.get({ plain: true }).id)
        .catch((error) => error);
};
