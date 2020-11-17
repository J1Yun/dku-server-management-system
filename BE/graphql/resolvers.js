const { GraphQLDate } = require('graphql-iso-date');

// From context after auth middlware, [userId] exists in context vars
module.exports = {
    Date: GraphQLDate,

    getServersFromClient: require('./ctrl/client/getServersFromClient'),

    // getReservations: on-going (반납건 제외 필요)
    getReservations: require('./ctrl/client/getReservations'),
    getReservableServers: require('./ctrl/client/getReservableServers'),

    postReservation: require('./ctrl/client/postReservation'),
    postReturn: require('./ctrl/client/postReturn'),
    getConfirmReservationFromClient: require('./ctrl/client/getConfirmReservationFromClient'),
};
