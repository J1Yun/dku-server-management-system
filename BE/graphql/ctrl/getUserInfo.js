// type User {
//     id: ID!,
//     userId: String!
//     type: Int!
//     name: String!
//     department: String!
//     tel: String
//     penalty: Int
// }
//getUserInfo: User

const models = require('../../models');
module.exports = async ({}, { userId }) => {
    return await models.user
        .findOne({
            attributes: ['id', 'userId', 'type', 'name', 'department', 'tel', 'penalty'],
            where: { userId },
            raw: true,
        })
        .then((result) => result)
        .catch((error) => error);
};
