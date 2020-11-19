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
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import SnackMessage from '../client/components/SnackMessage';
import { GET_SERVERS_FROM_ADMIN } from '../queries';
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

function StatusCircle({ color }) {
    return <FiberManualRecordIcon style={{ color }}>●</FiberManualRecordIcon>;
}

export default function ServerStatus() {
    const classes = useStyles();
    const [servers, setServers] = useState([]);
    const { loading, error, data } = useQuery(GET_SERVERS_FROM_ADMIN);

    useEffect(() => {
        if (data) {
            setServers(
                data.getServersFromAdmin.map((s) => {
                    return { ...s, ram: `${s.ram}GB`, status: 0 };
                }),
            );
        }
    }, [data, setServers]);

    if (loading) return <CircularProgress />;
    if (error)
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
                                    {row.status === 0 ? (
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
