import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useQuery } from 'react-apollo';
import { GET_MEMBERS } from '../queries';
import SnackMessage from './components/SnackMessage';
import PageTitle from '../components/PageTitle';

const sortModel = [
    {
        field: 'type',
        sort: 'asc',
    },
];

const columns = [
    { field: 'id', hide: true },
    { field: 'type', headerName: '권한', width: 100 },
    { field: 'name', headerName: '성명', width: 160 },
    { field: 'department', headerName: '소속', width: 220 },
    {
        field: 'userId',
        headerName: '이메일(아이디)',
        disableClickEventBubbling: true,
        width: 230,
    },
    {
        field: 'tel',
        headerName: '전화번호',
        disableClickEventBubbling: true,
        width: 170,
    },
    { field: 'penalty', headerName: '페널티' },
];

export default function Members() {
    const [members, setMembers] = useState([]);

    const { loading, error, data } = useQuery(GET_MEMBERS);

    useEffect(() => {
        if (data)
            setMembers(
                data.getMembers.map((m) => {
                    let type;
                    if (parseInt(m.type) === 0) {
                        type = '사용자';
                    }
                    if (parseInt(m.type) === 1) {
                        type = '관리자';
                    }
                    if (parseInt(m.type) === 2) {
                        type = '관리자';
                    }
                    return {
                        ...m,
                        type,
                    };
                }),
            );
    }, [data, setMembers]);

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <>
            <PageTitle title="회원 조회" />
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid sortModel={sortModel} columns={columns} rows={members} />
            </div>
        </>
    );
}
