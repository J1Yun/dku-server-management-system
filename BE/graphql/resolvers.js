const { GraphQLDate } = require('graphql-iso-date');

// From context after auth middlware, [userId] exists in context vars
module.exports = {
    Date: GraphQLDate,

    // CLIENT
    // GET
    getUserInfo: require('./ctrl/getUserInfo'),
    getServersFromClient: require('./ctrl/client/getServersFromClient'),
    getReservations: require('./ctrl/client/getReservations'),
    getReservableServers: require('./ctrl/client/getReservableServers'),
    getConfirmReservationFromClient: require('./ctrl/client/getConfirmReservationFromClient'),
    getMonthlyReservation: require('./ctrl/client/getMonthlyReservation'),

    // POST
    postReservation: require('./ctrl/client/postReservation'),
    postReturn: require('./ctrl/client/postReturn'),

    // ADMIN
    // GET
    getServersFromAdmin: require('./ctrl/admin/getServersFromAdmin'),
    getConfirms: require('./ctrl/admin/getConfirms'),
    getReturnConfirms: require('./ctrl/admin/getReturnConfirms'),
    getMembers: require('./ctrl/admin/getMembers'),
    getCalendarReservations: require('./ctrl/admin/getCalendarReservations'),
    getConfirmWaiting: require('./ctrl/admin/getConfirmWaiting'),

    // POST
    updateReservationApply: require('./ctrl/admin/updateReservationApply'),
    updateReturnApply: require('./ctrl/admin/updateReturnApply'),
};
