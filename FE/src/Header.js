import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router';
import { AppBar, Toolbar, Button, Chip, Divider } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { menus } from './menus';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        '& *': {
            color: 'white',
        },
    },
    logo: {
        fontSize: 18,
    },
    menuButton: {
        marginLeft: theme.spacing(1.5),
        fontSize: 16,
    },
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250,
    },
    header: {
        backgroundColor: '#0075F6',
    },
    headerContentWrapper: {
        display: 'flex',
        flexGrow: 1,
        alignItems: 'center',
    },
    logoWrapper: {
        flex: 1,
    },
    userLabel: {
        height: '24px',
        backgroundColor: '#094DCC',
        fontSize: '0.85rem',
        fontWeight: 500,
        '& span': {
            padding: '0px 8px',
            color: '#EAF1FF',
        },
        '&:hover': {
            backgroundColor: '#0031AA',
        },
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function UserInfo({ user }) {
    return (
        <List>
            <ListItem>
                <ListItemText primary={`소속: ${user.department}`} />
            </ListItem>
            <ListItem>
                <ListItemText primary={`이메일: ${user.userId}`} />
            </ListItem>
            <ListItem>
                <ListItemText primary={`전화번호: ${user.tel}`} />
            </ListItem>
            <ListItem>
                <ListItemText primary={`페널티: ${user.penalty}회`} />
            </ListItem>
        </List>
    );
}

export default function Header({ user }) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

    const triggerLogout = () => {
        axios
            .post('/user/logout')
            .then((result) => {
                window.location = '/?logout=client';
            })
            .catch((err) => {
                window.location = '/';
            });
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.header}>
                <Toolbar>
                    <React.Fragment>
                        <Dialog open={logoutOpen} TransitionComponent={Transition} keepMounted>
                            <DialogTitle>로그아웃 할까요?</DialogTitle>
                            <Divider />
                            <DialogActions>
                                <Button onClick={triggerLogout} color="primary">
                                    로그아웃
                                </Button>
                                <Button onClick={() => setLogoutOpen(false)} color="primary">
                                    취소
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog open={open} TransitionComponent={Transition} keepMounted>
                            <DialogTitle>{user.name} 님</DialogTitle>
                            <Divider />
                            <DialogContent>
                                <UserInfo user={user} />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={() => {
                                        setOpen(false);
                                        setLogoutOpen(true);
                                    }}
                                    color="primary"
                                >
                                    로그아웃
                                </Button>
                                <Button onClick={() => setOpen(false)} color="primary">
                                    닫기
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <div className={classes.headerContentWrapper}>
                            <div className={classes.logoWrapper}>
                                <Button
                                    component={Link}
                                    to={parseInt(user.type) === 0 ? '/client' : '/admin'}
                                    className={classes.logo}
                                    style={{ color: 'white' }}
                                >
                                    단국대학교 서버관리시스템
                                </Button>
                                <Chip
                                    label={`${user.department} ${user.name}`}
                                    className={classes.userLabel}
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                />
                            </div>
                            <div className={classes.menuWrapper}>
                                {parseInt(user.type) === 0
                                    ? menus.client.map((menu) => (
                                          <Button
                                              className={classes.menuButton}
                                              key={menu.id}
                                              component={Link}
                                              to={menu.link}
                                          >
                                              {menu.name}
                                          </Button>
                                      ))
                                    : menus.admin.map((menu) => (
                                          <Button
                                              className={classes.menuButton}
                                              key={menu.id}
                                              component={Link}
                                              to={menu.link}
                                          >
                                              {menu.name}
                                          </Button>
                                      ))}
                            </div>
                        </div>
                    </React.Fragment>
                </Toolbar>
            </AppBar>
        </div>
    );
}
