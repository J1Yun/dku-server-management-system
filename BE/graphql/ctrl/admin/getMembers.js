// type User {
//     id: ID!,
//     userId: String!
//     type: Int!
//     name: String!
//     department: String!
//     tel: String
//     penalty: Int
// }

const models = require('../../../models');
module.exports = async () => {
    return await models.user
        .findAll({
            attributes: ['id', 'userId', 'type', 'name', 'department', 'tel', 'penalty'],
            raw: true,
        })
        .then((result) => result)
        .catch((err) => err);
};
