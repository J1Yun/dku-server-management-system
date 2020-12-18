import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SnackMessage from './components/SnackMessage';
import MonthlyReservationDialog from './MonthlyReservationDialog';
import { useQuery } from 'react-apollo';
import { GET_SERVERS_FROM_CLIENT, GET_CONTAINER_STATUS } from '../queries';
import PageTitle from '../components/PageTitle';
import StatusCircle from '../admin/Console/StatusCircle';

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(5),
    },
    table: {
        minWidth: 500,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
}));

export default function Dashboard() {
    const classes = useStyles();
    const [servers, setServers] = useState([]);
    const [open, setOpen] = useState([]);
    const [containerStatus, setContainerStatus] = useState([]);
    const { loading, error, data } = useQuery(GET_SERVERS_FROM_CLIENT);
    const { error: errorStatus, data: dataStatus, refetch: refetchStatus } = useQuery(
        GET_CONTAINER_STATUS,
    );

    const initOpen = (length) => {
        const array = new Array(length).fill(false);
        setOpen(array);
    };
    const handleOpenClick = useCallback(
        (id) => {
            let array = [...open];
            array[id] = true;
            setOpen(array);
        },
        [open],
    );

    useEffect(() => {
        if (data) {
            setServers(
                data.getServersFromClient.map((s) => {
                    return { ...s, ram: `${s.ram}GB` };
                }),
            );
            initOpen(servers.length);
        }
    }, [data, setServers, servers.length]);

    useEffect(() => {
        if (dataStatus) setContainerStatus([...dataStatus.getContainerStatus]);
    }, [dataStatus, setContainerStatus]);

    const getStatus = (id) => {
        const targetStatusData = containerStatus.find((s) => s.id === parseInt(id));
        return targetStatusData ? targetStatusData.status : null;
    };

    const handleRefreshClick = useCallback(() => {
        setTimeout(() => refetchStatus(), 0);
    }, [refetchStatus]);

    if (loading) return <CircularProgress />;
    if (error || errorStatus)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <div>
            <PageTitle title="대시보드" />
            <SnackMessage message="단국대학교 서버관리시스템에 접속하신 것을 환영합니다. 사용 목적에 적합한 서버를 확인 후 선택하여 예약하시면 승인을 도와드리겠습니다." />
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" width={100}>
                                서버 ID
                            </TableCell>
                            <TableCell align="center">유형</TableCell>
                            <TableCell align="center">이름</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">
                                {'상태 '}
                                {loading && (
                                    <CircularProgress style={{ width: '14px', height: '14px' }} />
                                )}
                                <RefreshIcon
                                    style={{ fontSize: '14px', cursor: 'pointer' }}
                                    onClick={handleRefreshClick}
                                />
                            </TableCell>
                            <TableCell align="center" width={110}>
                                예약현황
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {servers.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center" component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row">
                                    {row.isPhysical === 0 ? '가상화 서버' : '물리 서버'}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.os}</TableCell>
                                <TableCell align="center">{row.cpu}</TableCell>
                                <TableCell align="center">{row.ram}</TableCell>
                                <TableCell align="center">
                                    {getStatus(row.id) === 1 ? (
                                        <StatusCircle color="green" />
                                    ) : (
                                        <StatusCircle color="crimson" />
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleOpenClick(row.id)}
                                    >
                                        조회
                                    </Button>

                                    {open[row.id] && (
                                        <MonthlyReservationDialog
                                            serverId={row.id}
                                            open={open}
                                            setOpen={setOpen}
                                        />
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
