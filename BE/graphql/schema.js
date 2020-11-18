const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    scalar Date

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
        applyOk: Int!
    }

    type MonthlyReservation {
        serverId: ID!
        start: Date!
        end: Date!
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

    type Query {
        getServersFromClient: [ServerClient]
        getReservations: [ReservationWithServerInfo]
        getReservableServers(start: Date!, end: Date!): [ServerClient]
        getConfirmReservationFromClient: [ConfirmReservation]
        getMonthlyReservation(serverId: ID!): [MonthlyReservation]
    }

    type Mutation {
        postReservation(reservation: ReservationInput!): Reservation
        postReturn(myReturn: ReturnInput!): ID
    }
`);
