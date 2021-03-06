import React, { useState, useCallback } from 'react';
import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Snackbar,
    Paper,
} from '@material-ui/core';
import queryString from 'query-string';
import ComputerIcon from '@material-ui/icons/Computer';
import { makeStyles } from '@material-ui/core/styles';
import SnackMessage from './client/components/SnackMessage';
import MuiAlert from '@material-ui/lab/Alert';
import axios from 'axios';
import Copyright from './Copyright';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(./dku-image.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function MainPage({ location }) {
    const classes = useStyles();
    const [user, setUser] = useState({
        userId: '',
        password: '',
    });
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setUser({ ...user, [name]: value });
        },
        [user],
    );

    const query = queryString.parse(location.search);

    const onSubmit = (e) => {
        e.preventDefault();
        axios
            .post('/api/user/signin', {
                user,
            })
            .then((response) => {
                response.data.type === 0
                    ? (window.location = '/client')
                    : (window.location = '/admin');
            })
            .catch((err) => {
                setAlertOpen(true);
                setMessage('????????? ?????? ??????????????? ?????? ??????????????????.');
            });
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: 30,
                }}
            >
                <div className={classes.paper}>
                    <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="error">
                            {message}
                        </Alert>
                    </Snackbar>
                    <Avatar className={classes.avatar}>
                        <ComputerIcon />
                    </Avatar>
                    <Typography style={{ fontSize: 25, fontWeight: 600, marginBottom: 20 }}>
                        ??????????????? SW???????????? ?????????????????????
                    </Typography>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        {query.signup && (
                            <SnackMessage message="??????????????? ?????????????????????. ????????? ??? ???????????? ???????????????." />
                        )}
                        {query.resetpw && (
                            <SnackMessage message="????????? ??????????????? ????????? ??????????????????." />
                        )}
                        {query.updatepw && (
                            <SnackMessage message="??????????????? ??????????????????. ????????? ??????????????? ?????? ??????????????????." />
                        )}
                        {query.expired && (
                            <SnackMessage message="????????? ????????? ?????????????????????. ?????? ??????????????????." />
                        )}
                        {query.logout && <SnackMessage message="??????????????? ???????????????????????????." />}
                        {query.inspire && (
                            <>
                                <SnackMessage message="???????????? ???????????????. ?????? ???????????? ?????? ???????????????, ????????? ???????????? ??????????????????." />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.submit}
                                    onClick={() => window.history.back()}
                                >
                                    ?????? ???????????? ?????? ????????????
                                </Button>
                            </>
                        )}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userId"
                            label="?????????"
                            name="userId"
                            autoComplete="email"
                            value={user.userId}
                            onChange={handleChange}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="????????????"
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            className={classes.submit}
                        >
                            {query.inspire ? '????????? ???????????? ?????????' : '?????????'}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/findpw" variant="body2">
                                    {'??????????????? ????????????????'}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {'????????? ????????? ???????????? ???????????????'}
                                </Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}
