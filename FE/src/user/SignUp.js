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
    Container,
    Snackbar,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Copyright from '../Copyright';
import SnackMessage from '../client/components/SnackMessage';
import PrivacyDialog from './PrivacyDialog';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const initialUser = {
    userId: '',
    name: '',
    password: '',
    passwordAgain: '',
    tel: '',
    department: '',
};

export default function SignUp() {
    const classes = useStyles();
    const [user, setUser] = useState(initialUser);
    const [open, setOpen] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
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

    const onSubmit = (e) => {
        e.preventDefault();
        axios
            .post('/api/user/signup', {
                user,
            })
            .then((result) => {
                if (result.data.error) {
                    const error = result.data.error.name;
                    if (error === 'SequelizeUniqueConstraintError') {
                        setAlertOpen(true);
                        setMessage('사용 중인 이메일입니다. 다른 이메일을 사용하세요.');
                    } else {
                        console.log(result.data.error);
                        setAlertOpen(true);
                        setMessage('입력 내용을 다시 확인해주세요.');
                    }
                } else {
                    // Success signup
                    window.location = '/?signup=client';
                }
            })
            .catch((err) => {
                setAlertOpen(true);
                setMessage('서버에 오류가 발생했습니다. 나중에 다시 시도해주세요.');
            });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        {message}
                    </Alert>
                </Snackbar>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    계정 만들기
                </Typography>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="department"
                                variant="outlined"
                                required
                                fullWidth
                                label="소속"
                                onChange={handleChange}
                                value={user.department}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                label="이름"
                                onChange={handleChange}
                                value={user.name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="tel"
                                variant="outlined"
                                required
                                fullWidth
                                label="전화번호"
                                onChange={handleChange}
                                value={user.tel}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                label="이메일 주소(아이디)"
                                name="userId"
                                onChange={handleChange}
                                value={user.userId}
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="비밀번호 (8자 이상)"
                                type="password"
                                onChange={handleChange}
                                value={user.password}
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="passwordAgain"
                                label="비밀번호 확인"
                                type="password"
                                onChange={handleChange}
                                value={user.passwordAgain}
                                autoComplete="current-password"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {privacyChecked === false ? (
                                <Button
                                    fullWidth
                                    color="secondary"
                                    variant="outlined"
                                    onClick={() => setOpen(true)}
                                >
                                    개인정보처리방침을 읽고 동의하세요
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => setOpen(true)}
                                >
                                    개인정보처리방침에 동의하였습니다
                                </Button>
                            )}
                            <PrivacyDialog
                                open={open}
                                setOpen={setOpen}
                                setPrivacyChecked={setPrivacyChecked}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SnackMessage message="이메일로 예약 정보가 발송되니 주소를 다시 한번 확인하세요. 모든 정보를 정확히 입력 후 개인정보처리방침에 동의해야 회원가입 신청 버튼이 활성화됩니다." />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={
                            user.userId.length > 0 &&
                            user.name.length > 0 &&
                            user.password.length > 0 &&
                            user.tel.length > 0 &&
                            user.department.length > 0 &&
                            user.password.length >= 8 &&
                            user.password === user.passwordAgain &&
                            privacyChecked === true
                                ? false
                                : true
                        }
                    >
                        회원가입 신청
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                계정이 있다면 로그인하세요
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}
