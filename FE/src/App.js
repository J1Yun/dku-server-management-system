import React from 'react';
import ClientHeader from './ClientHeader';
import AdminHeader from './AdminHeader';
import { ApolloProvider } from 'react-apollo';
import { Container } from '@material-ui/core';
import { AplClient as client } from './conf';
import Copyright from './Copyright';

// Cookie의 Token(expire 7d)을 넘겨서 type을 판단, App에만 넣어두면 헤더도 나눌 필요가 없음. 아니면 컨텍스트에서 userId, type까지 반환? 후자가 더 효율적일듯
export default function App({ ...props }) {
    return (
        <ApolloProvider client={client}>
            {props.location.pathname.split('/')[1] === 'client' ? (
                <ClientHeader />
            ) : (
                <AdminHeader />
            )}
            <Container style={{ padding: 10, paddingTop: 20 }}>{props.children}</Container>
            <Copyright />
        </ApolloProvider>
    );
}
