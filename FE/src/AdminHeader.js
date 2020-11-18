import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router';
import { AppBar, Toolbar, Button } from '@material-ui/core';

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
    menuWrapper: {},
}));

const menus = [
    {
        id: 1,
        name: '대시보드',
        link: '/admin/dashboard',
    },
    {
        id: 2,
        name: '승인처리',
        link: '/admin/confirm',
    },
    {
        id: 3,
        name: '회원조회',
        link: '/admin/members',
    },
];

export default function AdminHeader() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.header}>
                <Toolbar>
                    <React.Fragment>
                        <div className={classes.headerContentWrapper}>
                            <div className={classes.logoWrapper}>
                                <Button
                                    component={Link}
                                    to="/admin"
                                    className={classes.logo}
                                    style={{ color: 'white' }}
                                >
                                    단국대학교 서버관리시스템(관리자)
                                </Button>
                            </div>
                            <div className={classes.menuWrapper}>
                                {menus.map((menu) => (
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
