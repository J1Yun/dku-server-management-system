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

export const GET_RESERVATIONS = gql`
    query getReservations {
        getReservations {
            id
            __typename @skip(if: true)
            serverId
            start
            end
            serverOS
            serverName
        }
    }
`;

export const GET_RESERVABLE_SERVERS = gql`
    query getReservableServers($start: Date!, $end: Date!) {
        getReservableServers(start: $start, end: $end) {
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

export const POST_RETURN = gql`
    mutation postReturn($myReturn: ReturnInput!) {
        postReturn(myReturn: $myReturn)
    }
`;
