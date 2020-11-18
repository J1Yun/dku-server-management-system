import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Container } from '@material-ui/core';
import Copyright from './Copyright';
import SnackMessage from './client/components/SnackMessage';
import { useQuery } from 'react-apollo';
import { GET_USER_INFO } from './queries';

export default function App({ ...props }) {
    const [user, setUser] = useState();

    const { data, error } = useQuery(GET_USER_INFO);

    useEffect(() => {
        if (data) setUser(data.getUserInfo);
    }, [data, setUser]);

    if (error) window.location = '/?expired=client';

    return (
        <>
            {user && (
                <>
                    <Header user={user} />
                    {props.location.pathname.split('/')[1] === 'admin' &&
                    parseInt(user.type) === 0 ? (
                        <SnackMessage message="접근 권한이 없습니다." />
                    ) : (
                        <Container style={{ padding: 10, paddingTop: 20 }}>
                            {props.children}
                        </Container>
                    )}
                    <Copyright />
                </>
            )}
        </>
    );
}
