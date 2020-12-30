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

export default function FindPass() {
    const classes = useStyles();
    const [user, setUser] = useState(initialUser);
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
            .post('/api/user/resetpw', {
                user,
            })
            .then((result) => {
                if (result.data.error) {
                    console.log(result.data.error);
                    setAlertOpen(true);
                    setMessage('입력 내용을 다시 확인해주세요.');
                } else {
                    window.location = '/?resetpw=client';
                }
            })
            .catch((err) => {
                setAlertOpen(true);
                setMessage('입력 내용을 다시 확인해주세요.');
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
                    비밀번호 초기화
                </Typography>
                <form className={classes.form} onSubmit={onSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                            <SnackMessage message="이메일로 초기화된 비밀번호를 보내드리겠습니다. 로그인 후 비밀번호를 변경하세요." />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={user.userId.length > 0 && user.name.length > 0 ? false : true}
                    >
                        비밀번호 초기화
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                메인페이지로 돌아가기
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
