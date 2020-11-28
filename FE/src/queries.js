import gql from 'graphql-tag';

export const GET_USER_INFO = gql`
    query getUserInfo {
        getUserInfo {
            id
            userId
            type
            name
            department
            tel
            penalty
        }
    }
`;

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

export const GET_SERVERS_FROM_ADMIN = gql`
    query getServersFromAdmin {
        getServersFromAdmin {
            id
            __typename @skip(if: true)
            name
            os
            cpu
            ram
            location
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

export const GET_RESERVATIONS_FROM_ADMIN = gql`
    query getReservationsFromAdmin {
        getReservationsFromAdmin {
            id
            __typename @skip(if: true)
            serverId
            userDepartment
            userName
            createdAt
            start
            end
            applyOk
            returnOk
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

export const GET_CONFIRM_RESERVATION_FROM_CLIENT = gql`
    query getConfirmReservationFromClient {
        getConfirmReservationFromClient {
            id
            __typename @skip(if: true)
            createdAt
            start
            end
            os
            applyOk
            returnOk
        }
    }
`;

export const GET_MONTHLY_RESERVATION = gql`
    query getMonthlyReservation($serverId: ID!) {
        getMonthlyReservation(serverId: $serverId) {
            serverId
            start
            end
        }
    }
`;

export const GET_DEADLINE_RETURNS = gql`
    query getDeadlineReturns($dDay: Int!) {
        getDeadlineReturns(dDay: $dDay) {
            id
            userDepartment
            userName
            userTel
            start
            end
            serverId
            serverName
            late
        }
    }
`;

export const GET_CONFIRMS = gql`
    query getConfirms {
        getConfirms {
            id
            __typename @skip(if: true)
            serverId
            start
            end
            applyOk
            createdAt
            userName
            userDepartment
        }
    }
`;

export const GET_RETURN_CONFIRMS = gql`
    query getReturnConfirms {
        getReturnConfirms {
            id
            __typename @skip(if: true)
            userDepartment
            userName
            start
            end
            createdAt
            serverId
            serverName
        }
    }
`;

export const GET_MEMBERS = gql`
    query getMembers {
        getMembers {
            id
            __typename @skip(if: true)
            userId
            type
            name
            department
            tel
            penalty
        }
    }
`;

export const GET_CALENDAR_RESERVATIONS = gql`
    query getCalendarReservations {
        getCalendarReservations {
            id
            __typename @skip(if: true)
            start
            end
            serverId
            returnOk
            name
            department
        }
    }
`;

export const GET_HOSTS = gql`
    query getHosts {
        getHosts {
            id
            __typename @skip(if: true)
            name
            host
            cpu
            ram
            location
        }
    }
`;

export const GET_CONTAINERS = gql`
    query getContainers($hostId: ID) {
        getContainers(hostId: $hostId) {
            id
            __typename @skip(if: true)
            name
            os
            cpu
            ram
            host
            port
            password
            instanceName
        }
    }
`;

export const GET_DOC_RESERVATION = gql`
    query getDocReservation($id: ID!) {
        getDocReservation(id: $id) {
            id
            userName
            userDepartment
            createdAt
            start
            end
            serverName
            serverId
            os
            cpu
            ram
            purpose
        }
    }
`;

export const GET_DOC_RETURN = gql`
    query getDocReturn($id: ID!) {
        getDocReturn(id: $id) {
            id
            userName
            userDepartment
            createdAt
            start
            end
            serverName
            serverId
            os
            cpu
            ram
            uses
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

export const POST_HOST = gql`
    mutation postHost($host: HostInput!) {
        postHost(host: $host) {
            host
            port
            name
            password
            location
            cpu
            ram
        }
    }
`;

export const POST_CONTAINER = gql`
    mutation postContainer($container: ContainerInput!) {
        postContainer(host: $container) {
            name
            os
            cpu
            ram
            location
            password
            host
            port
            instanceName
            hostId
        }
    }
`;

export const POST_RETURN = gql`
    mutation postReturn($myReturn: ReturnInput!) {
        postReturn(myReturn: $myReturn)
    }
`;

export const UPDATE_RESERVATION_APPLY = gql`
    mutation updateReservationApply($id: ID!, $applyOk: Int!) {
        updateReservationApply(id: $id, applyOk: $applyOk)
    }
`;

export const UPDATE_RETURN_APPLY = gql`
    mutation updateReturnApply($id: ID!, $applyOk: Int!) {
        updateReturnApply(id: $id, applyOk: $applyOk)
    }
`;
