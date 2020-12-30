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
                setMessage('이메일 또는 비밀번호를 다시 확인해주세요.');
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
                        단국대학교 SW중심대학 서버관리시스템
                    </Typography>
                    <form className={classes.form} onSubmit={onSubmit} noValidate>
                        {query.signup && (
                            <SnackMessage message="회원가입이 완료되었습니다. 로그인 후 서비스를 이용하세요." />
                        )}
                        {query.resetpw && (
                            <SnackMessage message="새로운 비밀번호를 메일로 전송했습니다." />
                        )}
                        {query.updatepw && (
                            <SnackMessage message="비밀번호를 변경했습니다. 새로운 비밀번호로 다시 로그인하세요." />
                        )}
                        {query.expired && (
                            <SnackMessage message="로그인 정보가 유실되었습니다. 다시 로그인하세요." />
                        )}
                        {query.logout && <SnackMessage message="정상적으로 로그아웃되었습니다." />}
                        {query.inspire && (
                            <>
                                <SnackMessage message="로그인된 상태입니다. 현재 계정으로 다시 접속하거나, 새로운 계정으로 로그인하세요." />
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    className={classes.submit}
                                    onClick={() => window.history.back()}
                                >
                                    현재 계정으로 다시 접속하기
                                </Button>
                            </>
                        )}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userId"
                            label="이메일"
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
                            label="비밀번호"
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
                            {query.inspire ? '새로운 계정으로 로그인' : '로그인'}
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/findpw" variant="body2">
                                    {'비밀번호를 잊으셨나요?'}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {'계정을 만들고 서비스를 이용하세요'}
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
