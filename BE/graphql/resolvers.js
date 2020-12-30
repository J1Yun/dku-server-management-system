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
    updateUserPassword: require('./ctrl/client/updateUserPassword'),
    postReservation: require('./ctrl/client/postReservation'),
    postReturn: require('./ctrl/client/postReturn'),

    // ADMIN
    // GET
    getServersFromAdmin: require('./ctrl/admin/getServersFromAdmin'),
    getConfirms: require('./ctrl/admin/getConfirms'),
    getReturnConfirms: require('./ctrl/admin/getReturnConfirms'),
    getMembers: require('./ctrl/admin/getMembers'),
    getCalendarReservations: require('./ctrl/admin/getCalendarReservations'),
    getDeadlineReturns: require('./ctrl/admin/getDeadlineReturns'),
    getReservationsFromAdmin: require('./ctrl/admin/getReservationsFromAdmin'),
    getHosts: require('./ctrl/admin/getHosts'),
    getPhysicals: require('./ctrl/admin/getPhysicals'),
    getContainers: require('./ctrl/admin/getContainers'),

    // POST
    updateReservationApply: require('./ctrl/admin/updateReservationApply'),
    updateReturnApply: require('./ctrl/admin/updateReturnApply'),
    postHost: require('./ctrl/admin/postHost'),
    postPhysical: require('./ctrl/admin/postPhysical'),
    postContainer: require('./ctrl/admin/postContainer'),

    // DELETE
    deleteContainer: require('./ctrl/admin/deleteContainer'),
    deleteHost: require('./ctrl/admin/deleteHost'),

    // DOCUMENT
    getDocReservation: require('./ctrl/document/getDocReservation'),
    getDocReturn: require('./ctrl/document/getDocReturn'),

    // SSH - Status
    getHostStatus: require('./ctrl/ssh/getStatus').getHostStatus,
    getContainerStatus: require('./ctrl/ssh/getStatus').getContainerStatus,

    // SSH - Command By SuperAdmin
    postCmdToHost: require('./ctrl/ssh/postCommandByAdmin').postCmdToHost,
    postCmdToPhysical: require('./ctrl/ssh/postCommandByAdmin').postCmdToPhysical,
    postCmdToContainerViaHostUsingDocker: require('./ctrl/ssh/postCommandByAdmin')
        .postCmdToContainerViaHostUsingDocker,
    postInitContainer: require('./ctrl/ssh/postCommandByAdmin').postInitContainer,
};
