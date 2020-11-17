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
        applyOk: Int!
        createdAt: Date!
    }

    type ConfirmReservation{
        id: ID!
        serverId: ID!
        userId: String!
        createdAt: Date!
        start: Date!
        end: Date!
        os: String!
        applyOk: Int!
    }

    input ReservationInput {
        serverId: ID!
        start: Date!
        end: Date!
        purpose: String
    }

    type Query {
        getServersFromClient: [ServerClient]
        getConfirmReservationFromClient: [ConfirmReservation]
    }

    type Mutation {
        postReservation(reservation: ReservationInput!): Reservation
    }
`);
