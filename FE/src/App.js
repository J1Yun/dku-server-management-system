import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Container } from '@material-ui/core';
import Copyright from './Copyright';
import SnackMessage from './client/components/SnackMessage';
import { useQuery } from 'react-apollo';
import { GET_USER_INFO } from './queries';

// Cookie의 Token(expire 7d)을 넘겨서 type을 판단, App에만 넣어두면 헤더도 나눌 필요가 없음. 아니면 컨텍스트에서 userId, type까지 반환? 후자가 더 효율적일듯
export default function App({ ...props }) {
    const [user, setUser] = useState();

    const { data, error } = useQuery(GET_USER_INFO);

    useEffect(() => {
        if (data) setUser(data.getUserInfo);
    }, [data, setUser]);

    console.log(user);

    if (error)
        return (
            <SnackMessage message="죄송합니다. 서버와의 연결 중 오류가 발생했습니다. 잠시 후에 다시 시도해주세요. (react-apollo error)" />
        );

    return (
        <>
            {user && (
                <>
                    <Header user={user} />
                    <Container style={{ padding: 10, paddingTop: 20 }}>{props.children}</Container>
                    <Copyright />
                </>
            )}
        </>
    );
}
