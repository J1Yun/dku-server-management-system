import React, { useState, useCallback, useEffect } from 'react';
import {
    Button,
    CssBaseline,
    Grid,
    Typography,
    Container,
    TextField,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    Backdrop,
    CircularProgress,
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useMutation } from 'react-apollo';
import { GET_RESERVATIONS, POST_RETURN } from '../queries';
import SnackMessage from './components/SnackMessage';
import FinishApplyDialog from './FinishApplyDialog';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}));

const initialReturn = {
    reservationId: '',
    uses: '',
    rating: 5,
    review: '',
};

export default function ApplyReturn() {
    const classes = useStyles();

    const [reservations, setReservations] = useState([]);
    const [myReturn, setMyReturn] = useState(initialReturn);
    const [open, setOpen] = useState(false);
    // WHEN FINISH, DIALOG DISPLAYED
    const [dialogInfo, setDialogInfo] = useState({
        title: '',
        content: '',
        open: false,
    });

    const [postReturn] = useMutation(POST_RETURN, {
        onCompleted: () => {
            setOpen(false);
            setDialogInfo({
                title: '반납 신청이 완료되었습니다',
                content:
                    '반납 승인이 완료되면 이메일을 보내드리겠습니다. 예약, 반납 내역은 예약 확인 페이지에서도 확인할 수 있습니다.',
                open: true,
            });
        },
    });
    const { loading, error, data } = useQuery(GET_RESERVATIONS);

    useEffect(() => {
        if (data) setReservations(data.getReservations);
    }, [data, setReservations]);

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setMyReturn({ ...myReturn, [name]: value });
        },
        [myReturn],
    );

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    const onSubmit = (e) => {
        e.preventDefault();
        setOpen(true);
        postReturn({
            variables: {
                myReturn,
            },
        });
    };

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    서버 반납신청
                </Typography>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2} style={{ alignItems: 'center' }}>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" fullWidth required>
                                <InputLabel>반납건 선택</InputLabel>
                                <Select
                                    name="reservationId"
                                    value={myReturn.reservationId}
                                    onChange={handleChange}
                                    label="반납건 선택"
                                    required
                                >
                                    <MenuItem value="">
                                        <em>반납건 선택</em>
                                    </MenuItem>
                                    {reservations.map((r) => (
                                        <MenuItem key={r.id} value={r.id}>
                                            [{r.start}~{r.end}] {r.serverName} ({r.serverOS})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="uses"
                                variant="outlined"
                                label="사용 상세"
                                multiline
                                value={myReturn.uses}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                style={{
                                    fontSize: 19,
                                    fontWeight: 500,
                                    textAlign: 'center',
                                    paddingTop: 10,
                                }}
                            >
                                서비스 만족도 조사 (선택사항)
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography
                                style={{
                                    fontSize: 17,
                                    textAlign: 'right',
                                    marginRight: 33,
                                    paddingBottom: 3,
                                }}
                            >
                                만족도 별점
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Rating name="rating" value={myReturn.rating} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="review"
                                variant="outlined"
                                label="서비스 이용 후기"
                                multiline
                                value={myReturn.review}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SnackMessage message="서버를 초기 상태로 원복하지 않거나 반납일을 초과하는 경우 페널티가 부여됩니다. 서비스 이용에 불편함이 있으셨다면 이용 후기에 내용을 적어주세요." />
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        className={classes.submit}
                        disabled={
                            myReturn.reservationId > 0 && myReturn.uses.length > 0 ? false : true
                        }
                    >
                        서버 반납신청
                    </Button>
                    <Backdrop className={classes.backdrop} open={open}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <FinishApplyDialog dialogInfo={dialogInfo} />
                </form>
            </div>
        </Container>
    );
}
