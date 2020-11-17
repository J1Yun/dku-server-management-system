const { GraphQLDate } = require('graphql-iso-date');

// From context after auth middlware, [userId] exists in context vars
module.exports = {
    Date: GraphQLDate,

    getServersFromClient: require('./ctrl/client/getServersFromClient'),
    postReservation: require('./ctrl/client/postReservation'),
    getConfirmReservationFromClient: require('./ctrl/client/getConfirmReservationFromClient'),
};
