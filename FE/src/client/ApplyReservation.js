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
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import SnackMessage from './components/SnackMessage';
import FinishApplyDialog from './FinishApplyDialog';
import { useQuery, useMutation } from 'react-apollo';
import { POST_RESERVATION, GET_RESERVABLE_SERVERS } from '../queries';

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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: 'dodgerblue',
    },
}));

const initialReservation = {
    start: new moment().format('YYYY-MM-DD'),
    end: new moment().format('YYYY-MM-DD'),
    serverId: '',
    purpose: '',
};

export default function ApplyReservation() {
    const classes = useStyles();
    const [reservableServers, setReservableServers] = useState([]);
    const [reservation, setReservation] = useState(initialReservation);
    const [open, setOpen] = useState(false);

    // WHEN FINISH, DIALOG DISPLAYED
    const [dialogInfo, setDialogInfo] = useState({
        title: '',
        content: '',
        open: false,
    });

    const { loading, error, data, refetch } = useQuery(GET_RESERVABLE_SERVERS, {
        variables: {
            start: reservation.start,
            end: reservation.end,
        },
    });

    useEffect(() => {
        if (data) {
            setReservableServers(data.getReservableServers);
        }
    }, [data, setReservableServers]);

    const [postReservation] = useMutation(POST_RESERVATION, {
        onCompleted: (response) => {
            const result = response.postReservation;
            setOpen(false);
            setDialogInfo({
                title: '?????? ????????? ?????????????????????',
                content: `[??????ID: ${result.serverId}, ?????????: ${result.start}, ?????????: ${result.end}, ?????????: ${result.createdAt}] ????????? ???????????? ???????????? ????????????????????????. ?????? ?????? ?????????????????? ????????? ??? ????????????.`,
                open: true,
            });
        },
    });

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            if (name === 'start' || name === 'end') {
                if (
                    (name === 'start' && value > reservation.end) ||
                    (name === 'end' && value < reservation.start)
                ) {
                    return;
                } else {
                    refetch();
                    setReservation({ ...reservation, [name]: value, serverId: '' });
                }
            } else {
                setReservation({ ...reservation, [name]: value });
            }
        },
        [reservation, refetch],
    );

    const onSubmit = (e) => {
        e.preventDefault();
        setOpen(true);
        postReservation({
            variables: {
                reservation,
            },
        });
    };

    if (error)
        return (
            <SnackMessage message="???????????????. ????????? ?????? ??? ????????? ??????????????????. ?????? ?????? ?????? ??????????????????." />
        );

    return (
        <Container component="main" maxWidth="sm">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    ?????? ????????????
                </Typography>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="start"
                                id="date"
                                type="date"
                                variant="outlined"
                                value={reservation.start}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                label="?????????"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="end"
                                id="date"
                                type="date"
                                variant="outlined"
                                value={reservation.end}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                label="?????????"
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <FormControl variant="outlined" fullWidth required>
                                    <InputLabel>?????? ??????</InputLabel>
                                    <Select
                                        name="serverId"
                                        value={reservation.serverId}
                                        onChange={handleChange}
                                        label="?????? ??????"
                                        required
                                    >
                                        <MenuItem value="">
                                            <em>?????? ??????(????????? ????????? ??????????????? ????????? ??????)</em>
                                        </MenuItem>
                                        {reservableServers.map((r) => (
                                            <MenuItem key={r.id} value={r.id}>
                                                {r.name} ({r.os}/CPU {r.cpu}/RAM {r.ram}GB)
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="purpose"
                                variant="outlined"
                                label="?????? ??????"
                                multiline
                                value={reservation.purpose}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SnackMessage message="?????? ????????? ???????????? ????????? ???????????? ????????? ????????? ?????? ????????? ???????????? ??? ????????????. ?????? ????????? ????????? ?????? ??? ??????????????????. ?????? ??? ????????? ????????? ?????? ??????????????? ?????? 3??? ?????? ?????? ????????? ?????? ???????????????." />
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
                            reservation.serverId > 0 && reservation.purpose.length > 0
                                ? false
                                : true
                        }
                    >
                        ?????? ????????????
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
