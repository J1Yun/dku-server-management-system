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
        start: Date!
        end: Date!
        purpose: String
        applyOk: String!
        createdAt: Date!
    }

    input ReservationInput {
        serverId: ID!
        start: Date!
        end: Date!
        purpose: String
    }

    type Query {
        getServersFromClient: [ServerClient]
    }

    type Mutation {
        postReservation(reservation: ReservationInput!): Reservation
    }
`);
