import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@material-ui/core';
import StatusCircle from './StatusCircle';
import { useQuery } from 'react-apollo';
import { GET_CONTAINER_STATUS } from '../../queries';
import SnackMessage from '../../client/components/SnackMessage';

export default function ContainerConsole({ containers, classes }) {
    const [containerStatus, setContainerStatus] = useState([]);
    const { error, data, refetch } = useQuery(GET_CONTAINER_STATUS);

    useEffect(() => {
        if (data) setContainerStatus([...data.getContainerStatus]);
    }, [data, setContainerStatus]);

    const getStatus = (id) => {
        const targetStatusData = containerStatus.find((s) => s.id === parseInt(id));
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
                        <TableCell align="center">인스턴스ID</TableCell>
                        <TableCell align="center">인스턴스 이름</TableCell>
                        <TableCell align="center">Host IP</TableCell>
                        <TableCell align="center">PORT</TableCell>
                        <TableCell align="center">OS</TableCell>
                        <TableCell align="center">vCPU</TableCell>
                        <TableCell align="center">RAM</TableCell>
                        <TableCell align="center">패스워드</TableCell>
                        <TableCell align="center">상태</TableCell>
                        <TableCell align="center" width={160}>
                            작업
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {containers.length > 0 &&
                        containers.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{row.instanceName}</TableCell>
                                <TableCell align="center">{row.host}</TableCell>
                                <TableCell align="center">{row.port}</TableCell>
                                <TableCell align="center">{row.os}</TableCell>
                                <TableCell align="center">{row.cpu}</TableCell>
                                <TableCell align="center">{row.ram}GB</TableCell>
                                <TableCell align="center">{row.password}</TableCell>
                                <TableCell align="center">
                                    {getStatus(row.id) === 1 ? (
                                        <StatusCircle color="green" />
                                    ) : (
                                        <StatusCircle color="crimson" />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Button size="small" color="secondary" variant="outlined">
                                        재부팅
                                    </Button>
                                    <Button
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                        style={{ marginLeft: 4 }}
                                    >
                                        삭제
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
