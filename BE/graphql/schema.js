const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    scalar Date

    type User {
        id: ID!,
        userId: String!
        type: Int!
        name: String!
        department: String!
        tel: String
        penalty: Int
    }

    type ServerClient {
        id: ID!
        name: String!
        os: String!
        cpu: Int!
        ram: Int!
    }

    type Reservation {
        id: ID!
        serverId: ID!
        start: Date
        end: Date
        purpose: String
        applyOk: Int
        createdAt: Date
    }

    type ReservationWithServerInfo {
        id: ID!
        serverId: ID!
        start: Date
        end: Date
        serverOS: String
        serverName: String
    }

    type ConfirmReservation {
        id: ID!
        serverId: ID!
        userId: String!
        createdAt: Date!
        start: Date!
        end: Date!
        os: String!
        applyOk: Int
        returnOk: Int
    }

    type ReservationFromAdmin{
        id: ID!
        serverId: ID!
        userDepartment: String!
        userName: String!
        createdAt: Date!
        start: Date!
        end: Date!
        applyOk: Int
        returnOk: Int
    }

    type MonthlyReservation {
        serverId: ID!
        start: Date!
        end: Date!
    }

    type ServerAdmin{
        id: ID!
        name: String!
        os: String!
        cpu: Int!
        ram: Int!
        location: String!
    }

    type Container{
        id: ID!
        name: String!
        os: String!
        cpu: Int!
        ram: Int!
        host: String!
        port: String!
        password: String!
        instanceName: String!
        hostId: ID!
    }

    type Host{
        id: ID!
        host: String!
        port: String!
        name: String!
        password: String!
        location: String!
        cpu: Int!
        ram: Int!
    }

    type GetHost{
        id: ID!
        name: String!
        host: String!
        cpu: Int!
        ram: Int!
        location: String!
    }

    type AdminConfirm {
        id: ID!
        serverId: ID!
        start: Date!
        end: Date!
        applyOk: Int!
        createdAt: Date!
        userName: String
        userDepartment: String
    }

    type AdminReturnConfirm {
        id: ID!
        createdAt: Date!
        userDepartment: String!
        userName: String!
        start: Date!
        end: Date!
        serverId: ID!
        serverName: String!
    }

    type CalendarReservation {
        id: ID!
        start: Date!
        end: Date!
        serverId: ID!
        returnOk: Int!
        name: String
        department: String
    }

    type DeadlineReturn {
        id: ID!
        userDepartment: String
        userName: String
        userTel: String
        start: Date!
        end: Date!
        serverId: ID!
        serverName: String
        late: Int
    }

    type DocReservation {
        id: ID!
        userName: String!
        userDepartment: String!
        createdAt: Date!
        start: Date!
        end: Date!
        serverName: String!
        serverId: String!
        os: String!
        cpu: String!
        ram: String!
        purpose: String!
    }

    type DocReturn {
        id: ID!
        userName: String!
        userDepartment: String!
        createdAt: Date!
        start: Date!
        end: Date!
        serverName: String!
        serverId: String!
        os: String!
        cpu: String!
        ram: String!
        uses: String!
    }

    type Status {
        id: Int!
        status: Int!
    }

    input ReservationInput {
        serverId: ID!
        start: Date!
        end: Date!
        purpose: String
    }

    input ReturnInput {
        reservationId: ID!
        uses: String
        rating: Int
        review: String
    }

    input HostInput {
        host: String!
        port: String!
        name: String!
        password: String!
        location: String!
        cpu: Int!
        ram: Int!
    }

    input ContainerInput {
        name: String!
        os: String!
        password: String!
    }

    type Query {
        getUserInfo: User
        getServersFromClient: [ServerClient]
        getServersFromAdmin:[ServerAdmin]
        getReservations: [ReservationWithServerInfo]
        getReservableServers(start: Date!, end: Date!): [ServerClient]
        getConfirmReservationFromClient: [ConfirmReservation]
        getMonthlyReservation(serverId: ID!): [MonthlyReservation]
        getConfirms: [AdminConfirm]
        getReturnConfirms: [AdminReturnConfirm]
        getMembers: [User]
        getCalendarReservations: [CalendarReservation]
        getDeadlineReturns(dDay: Int!): [DeadlineReturn]
        getDocReservation(id: ID!): [DocReservation]
        getDocReturn(id: ID!): [DocReturn]
        getReservationsFromAdmin: [ReservationFromAdmin]
        getHosts: [Host]
        getContainers(hostId: ID): [Container]
        getHostStatus: [Status]
        getContainerStatus: [Status]
    }

    type Mutation {
        postReservation(reservation: ReservationInput!): Reservation
        postReturn(myReturn: ReturnInput!): ID
        postHost(host: HostInput!): Host
        postContainer(container: ContainerInput!, hostId: ID!): Boolean
        updateReservationApply(id: ID!, applyOk: Int!): ID
        updateReturnApply(id: ID!, applyOk: Int!): ID
        postCmdToHost(command: String!, hostId: ID!): String
        postCmdToContainerViaHostUsingDocker(command: String!, containerId: ID!): String
        postInitContainer(containerId: ID!): String
        deleteContainer(containerId: ID!): Boolean
        deleteHost(hostId: ID!): Boolean
    }
`);
