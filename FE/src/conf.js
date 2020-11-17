import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

export const URIS = {
    REST_URI: 'http://localhost:4000',
    GRAPHQL_URI: 'http://localhost:4000/graphql',
};

export const AplClient = new ApolloClient({
    link: new createHttpLink({
        uri: URIS.GRAPHQL_URI,
        withCredentials: true,
    }),
    credentials: 'include',
    cache: new InMemoryCache(),
});
