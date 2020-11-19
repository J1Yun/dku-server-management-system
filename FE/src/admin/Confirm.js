import React, { useState, useEffect, useCallback } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';
import {
    IconButton,
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
import SnackMessage from './components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { useQuery } from 'react-apollo';
import { GET_CONFIRMS } from '../queries';

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
    const [confirms, setConfirms] = useState([]);
    const [open, setOpen] = useState([]);
    const { loading, error, data, refetch } = useQuery(GET_CONFIRMS);

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
            setConfirms(
                data.getConfirms.map((c) => {
                    return { ...c };
                }),
            );
            initOpen(confirms.length);
        }
    }, [data, setConfirms, confirms.length]);

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <>
            <PageTitle title="승인을 기다리는 예약" />
            <TableContainer component={Paper} className={classes.tableWrapper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">상세내역</TableCell>
                            <TableCell align="center">소속</TableCell>
                            <TableCell align="center">성명</TableCell>
                            <TableCell align="center">예약 신청일</TableCell>
                            <TableCell align="center">시작일</TableCell>
                            <TableCell align="center">반납일</TableCell>
                            <TableCell align="center">서버ID</TableCell>
                            <TableCell align="center">승인여부</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {confirms.map((row, idx) => (
                            <TableRow key={idx} className={classes.root}>
                                <TableCell align="center">
                                    <IconButton
                                        aria-label="expand row"
                                        size="small"
                                        onClick={() => setOpen(!open)}
                                    >
                                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">{row.userDepartment}</TableCell>
                                <TableCell align="center">{row.userName}</TableCell>
                                <TableCell align="center">{row.createdAt}</TableCell>
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
        </>
    );
}
