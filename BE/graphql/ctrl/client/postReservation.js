// type ReservationInput {
//     serverId: ID!
//     start: Date!
//     end: Date!
//     purpose: String
// }
// type Reservation {
//     id: ID!
//     serverId: ID!
//     start: Date!
//     end: Date!
//     purpose: String,
//     applyOk: String!,
//     createdAt: Date!
// }
// postReservation(reservation: ReservationInput!): Reservation
const models = require('../../../models');
const moment = require('moment');

module.exports = async ({ reservation }, { userId }) => {
    return await models.reservation
        .create({
            userId,
            ...reservation,
        })
        .then((result) => {
            const data = result.get({ plain: true });
            return {
                id: data.id,
                serverId: data.serverId,
                start: data.start,
                end: data.end,
                purpose: data.purpose,
                applyOk: data.applyOk,
                createdAt: moment(data.createdAt).format('YYYY-MM-DD'),
            };
        })
        .catch((error) => error);
};
