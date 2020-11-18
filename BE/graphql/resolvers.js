const { GraphQLDate } = require('graphql-iso-date');

// From context after auth middlware, [userId] exists in context vars
module.exports = {
    Date: GraphQLDate,

    // CLIENT
    // GET
    getServersFromClient: require('./ctrl/client/getServersFromClient'),
    getReservations: require('./ctrl/client/getReservations'),
    getReservableServers: require('./ctrl/client/getReservableServers'),
    getConfirmReservationFromClient: require('./ctrl/client/getConfirmReservationFromClient'),
    getMonthlyReservation: require('./ctrl/client/getMonthlyReservation'),

    // POST
    postReservation: require('./ctrl/client/postReservation'),
    postReturn: require('./ctrl/client/postReturn'),
};
