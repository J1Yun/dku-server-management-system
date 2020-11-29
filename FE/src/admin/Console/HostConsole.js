import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import StatusCircle from './StatusCircle';
import { useQuery } from 'react-apollo';
import { GET_HOST_STATUS } from '../../queries';
import SnackMessage from '../../client/components/SnackMessage';

export default function HostConsole({ hosts, classes, handleOpenContainerConsole }) {
    const [hostStatus, setHostStatus] = useState([]);
    const { error, data, refetch } = useQuery(GET_HOST_STATUS);

    useEffect(() => {
        if (data) setHostStatus([...data.getHostStatus]);
    }, [data, setHostStatus]);

    const getStatus = (id) => {
        const targetStatusData = hostStatus.find((s) => s.id === parseInt(id));
        return targetStatusData ? targetStatusData.status : null;
    };

    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <TableContainer className={classes.tableWrapper} component={Paper}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">서버ID</TableCell>
                        <TableCell align="center">서버명</TableCell>
                        <TableCell align="center">IP</TableCell>
                        <TableCell align="center">CPU</TableCell>
                        <TableCell align="center">RAM</TableCell>
                        <TableCell align="center">위치</TableCell>
                        <TableCell align="center">가동상태</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {hosts.map((row) => (
                        <TableRow
                            key={row.id}
                            onClick={() => handleOpenContainerConsole(row)}
                            style={{ cursor: 'pointer' }}
                        >
                            <TableCell align="center" component="th" scope="row">
                                {row.id}
                            </TableCell>
                            <TableCell align="center">{row.name}</TableCell>
                            <TableCell align="center">{row.host}</TableCell>
                            <TableCell align="center">{row.cpu}</TableCell>
                            <TableCell align="center">{row.ram}GB</TableCell>
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
    );
}
