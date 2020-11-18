import React, { useState, useEffect, useCallback } from 'react';
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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import SnackMessage from './components/SnackMessage';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import { GET_MONTHLY_RESERVATION } from '../queries';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(0.3),
    },
    table: {
        minWidth: 400,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
}));

export default function MonthlyReservationDialog({ serverId, open, setOpen }) {
    const classes = useStyles();
    const [reservations, setReservations] = useState([]);
    const { loading, error, data } = useQuery(GET_MONTHLY_RESERVATION, {
        variables: { serverId },
    });

    const handleCloseClick = useCallback(() => {
        const array = open.slice().fill(false);
        setOpen(array);
    }, [open, setOpen]);

    useEffect(() => {
        if (data) setReservations(data.getMonthlyReservation);
    }, [data, setReservations]);

    return (
        <div>
            <Dialog open={open[serverId]} TransitionComponent={Transition} keepMounted>
                <DialogTitle>선택한 서버의 예약 현황</DialogTitle>
                <DialogContent>
                    {loading && <CircularProgress />}
                    {error && (
                        <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
                    )}
                    {reservations.length > 0 ? (
                        <TableContainer className={classes.tableWrapper} component={Paper}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">시작일</TableCell>
                                        <TableCell align="center">반납일</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reservations.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell align="center">{row.start}</TableCell>
                                            <TableCell align="center">{row.end}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <SnackMessage
                            message={`본 서버는 2달간 예약 내역이 없습니다. (서버ID: ${serverId})`}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseClick} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
