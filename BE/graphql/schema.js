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
    }

    type Mutation {
        postReservation(reservation: ReservationInput!): Reservation
        postReturn(myReturn: ReturnInput!): ID
    }
`);
