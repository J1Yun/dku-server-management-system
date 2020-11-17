import gql from 'graphql-tag';

export const GET_SERVERS_FROM_CLIENT = gql`
    query getServersFromClient {
        getServersFromClient {
            id
            __typename @skip(if: true)
            name
            os
            cpu
            ram
        }
    }
`;

export const POST_RESERVATION = gql`
    mutation postReservation($reservation: ReservationInput!) {
        postReservation(reservation: $reservation) {
            id
            serverId
            start
            end
            purpose
            applyOk
            createdAt
        }
    }
`;
