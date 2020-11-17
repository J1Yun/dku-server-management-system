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

    type Query {
        getServersFromClient: [ServerClient]
    }
`);
