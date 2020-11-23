import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from 'react-apollo';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Button,
} from '@material-ui/core';
import moment from 'moment';
import PageTitle from '../components/PageTitle';
import SnackMessage from './components/SnackMessage';
import { GET_CONFIRM_RESERVATION_FROM_CLIENT } from '../queries';

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

function Row(props) {
    const { row } = props;
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell component="th" scope="row" align="center">
                    {moment(row.createdAt).format('YYYY-MM-DD')}
                </TableCell>
                <TableCell align="center">{row.start}</TableCell>
                <TableCell align="center">{row.end}</TableCell>
                <TableCell align="center">{row.os}</TableCell>
                <TableCell align="center">
                    {row.applyOk === 0 && <span style={{ color: '#777' }}>승인대기</span>}
                    {row.applyOk === 1 && <span style={{ color: 'green' }}>승인됨</span>}
                    {row.applyOk === 2 && <span style={{ color: 'crimson' }}>거부됨</span>}
                </TableCell>
                <TableCell align="center">
                    {row.returnOk === 0 && <span style={{ color: '#777' }}>승인대기</span>}
                    {row.returnOk === 1 && <span style={{ color: 'green' }}>승인됨</span>}
                    {row.returnOk === 2 && <span style={{ color: 'crimson' }}>거부됨</span>}
                    {row.returnOk === 3 && <span style={{ color: '#777' }}>미반납</span>}
                </TableCell>
                <TableCell align="center" width={100}>
                    {row.applyOk === 1 && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() => window.open(`/doc/res?id=${row.id}`, '_blank')}
                        >
                            PDF 열기
                        </Button>
                    )}
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function ConfirmReservation() {
    const classes = useRowStyles();
    const [reservations, setConfirmReservation] = useState([]);
    const { loading, error, data } = useQuery(GET_CONFIRM_RESERVATION_FROM_CLIENT);

    useEffect(() => {
        if (data) {
            setConfirmReservation(
                data.getConfirmReservationFromClient.map((c) => {
                    return { ...c };
                }),
            );
        }
    }, [data, setConfirmReservation]);

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <>
            <PageTitle title="나의 예약내역" />
            <TableContainer component={Paper} className={classes.tableWrapper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">예약 신청일</TableCell>
                            <TableCell align="center">시작일</TableCell>
                            <TableCell align="center">반납일</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">승인여부</TableCell>
                            <TableCell align="center">반납여부</TableCell>
                            <TableCell align="center">확인서</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations.map((row, idx) => (
                            <Row key={idx} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
