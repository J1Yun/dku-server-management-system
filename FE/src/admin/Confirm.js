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
import ReservationConfirmDialog from './components/ReservationConfirmDialog';
import ReturnConfirmDialog from './components/ReturnConfirmDialog';
import SnackMessage from './components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { useQuery } from 'react-apollo';
import { GET_CONFIRMS, GET_RETURN_CONFIRMS } from '../queries';

const useRowStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    tableWrapper: {
        marginTop: theme.spacing(1),
    },
}));

export default function Confirm() {
    const classes = useRowStyles();
    const [reservations, setReservations] = useState([]);
    const [returns, setReturns] = useState([]);
    const [open, setOpen] = useState([]);
    const [returnOpen, setReturnOpen] = useState([]);
    const { loading, error, data, refetch } = useQuery(GET_CONFIRMS);
    const {
        loading: loadingReturns,
        error: errorReturns,
        data: dataReturns,
        refetch: refetchReturns,
    } = useQuery(GET_RETURN_CONFIRMS);

    const initOpen = (length) => {
        const array = new Array(length).fill(false);
        setOpen(array);
    };

    const initReturnOpen = (length) => {
        const array = new Array(length).fill(false);
        setReturnOpen(array);
    };

    const handleOpenClick = useCallback(
        (id) => {
            let array = [...open];
            array[id] = true;
            setOpen(array);
        },
        [open],
    );

    const handleReturnOpenClick = useCallback(
        (id) => {
            let array = [...returnOpen];
            array[id] = true;
            setReturnOpen(array);
        },
        [returnOpen],
    );

    useEffect(() => {
        if (data) {
            setReservations(
                data.getConfirms.map((c) => {
                    return { ...c };
                }),
            );
            initReturnOpen(reservations.length);
        }
    }, [data, setReservations, reservations.length]);

    useEffect(() => {
        if (dataReturns) {
            setReturns([...dataReturns.getReturnConfirms]);
            initOpen(returns.length);
        }
    }, [dataReturns, setReservations, returns.length]);

    if (loading || loadingReturns) return <CircularProgress />;
    if (error || errorReturns)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <>
            <div>
                <PageTitle title="승인을 기다리는 예약" />
                <TableContainer component={Paper} className={classes.tableWrapper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">예약 신청일</TableCell>
                                <TableCell align="center">소속</TableCell>
                                <TableCell align="center">성명</TableCell>
                                <TableCell align="center">시작일</TableCell>
                                <TableCell align="center">반납일</TableCell>
                                <TableCell align="center">서버ID</TableCell>
                                <TableCell align="center">승인여부</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reservations.map((row, idx) => (
                                <TableRow key={idx} className={classes.root}>
                                    <TableCell align="center">{row.createdAt}</TableCell>
                                    <TableCell align="center">{row.userDepartment}</TableCell>
                                    <TableCell align="center">{row.userName}</TableCell>
                                    <TableCell align="center">{row.start}</TableCell>
                                    <TableCell align="center">{row.end}</TableCell>
                                    <TableCell align="center">{row.serverId}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            style={{ color: '#777' }}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleOpenClick(row.id)}
                                        >
                                            승인대기
                                        </Button>
                                        <ReservationConfirmDialog
                                            id={row.id}
                                            open={open}
                                            setOpen={setOpen}
                                            refetch={refetch}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!loading && reservations.length === 0 && (
                    <SnackMessage message="처리할 건이 없습니다." />
                )}
            </div>
            <div style={{ marginTop: 35 }}>
                <PageTitle title="승인을 기다리는 반납" />
                <TableContainer component={Paper} className={classes.tableWrapper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">반납 신청일</TableCell>
                                <TableCell align="center">소속</TableCell>
                                <TableCell align="center">성명</TableCell>
                                <TableCell align="center">시작일</TableCell>
                                <TableCell align="center">반납일</TableCell>
                                <TableCell align="center">서버ID</TableCell>
                                <TableCell align="center">서버명</TableCell>
                                <TableCell align="center">승인여부</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {returns.map((row, idx) => (
                                <TableRow key={idx} className={classes.root}>
                                    <TableCell align="center">{row.createdAt}</TableCell>
                                    <TableCell align="center">{row.userDepartment}</TableCell>
                                    <TableCell align="center">{row.userName}</TableCell>
                                    <TableCell align="center">{row.start}</TableCell>
                                    <TableCell align="center">{row.end}</TableCell>
                                    <TableCell align="center">{row.serverId}</TableCell>
                                    <TableCell align="center">{row.serverName}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            style={{ color: '#777' }}
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleReturnOpenClick(row.id)}
                                        >
                                            승인대기
                                        </Button>
                                        <ReturnConfirmDialog
                                            id={row.id}
                                            open={returnOpen}
                                            setOpen={setReturnOpen}
                                            refetch={refetchReturns}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!loadingReturns && returns.length === 0 && (
                    <SnackMessage message="처리할 건이 없습니다." />
                )}
            </div>
        </>
    );
}
