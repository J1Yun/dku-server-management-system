import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from '@material-ui/core';
import StatusCircle from './Console/StatusCircle';
import SnackMessage from '../client/components/SnackMessage';
import { GET_SERVERS_FROM_ADMIN, GET_CONTAINER_STATUS } from '../queries';
import PageTitle from '../components/PageTitle';

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(1),
    },
    table: {
        minWidth: 500,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
}));

export default function ServerStatus() {
    const classes = useStyles();
    const [servers, setServers] = useState([]);
    const [containerStatus, setContainerStatus] = useState([]);
    const { loading, error, data } = useQuery(GET_SERVERS_FROM_ADMIN);
    const { error: errorStatus, data: dataStatus, refetch: refetchStatus } = useQuery(
        GET_CONTAINER_STATUS,
    );

    useEffect(() => {
        if (data) {
            setServers(
                data.getServersFromAdmin.map((s) => {
                    return { ...s, ram: `${s.ram}GB` };
                }),
            );
        }
    }, [data, setServers]);

    useEffect(() => {
        if (dataStatus) setContainerStatus([...dataStatus.getContainerStatus]);
    }, [dataStatus, setContainerStatus]);

    const getStatus = (id) => {
        const targetStatusData = containerStatus.find((s) => s.id === parseInt(id));
        return targetStatusData ? targetStatusData.status : null;
    };

    if (loading) return <CircularProgress />;
    if (error || errorStatus)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <div>
            <PageTitle title="대시보드" />
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">서버ID</TableCell>
                            <TableCell align="center">서버명</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">위치</TableCell>
                            <TableCell align="center">가동상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center" component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.os}</TableCell>
                                <TableCell align="center">{row.cpu}</TableCell>
                                <TableCell align="center">{row.ram}</TableCell>
                                <TableCell align="center">{row.location}</TableCell>
                                <TableCell align="center">
                                    {getStatus(row.id) === 1 ? (
                                        <StatusCircle color="green" />
                                    ) : (
                                        <StatusCircle color="crimson" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
