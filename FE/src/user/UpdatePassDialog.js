import React, { useCallback, useState } from 'react';
import { Button, Divider, Grid, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useMutation } from 'react-apollo';
import { UPDATE_USER_PASSWORD } from '../queries';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function InvalidDialog({ open, setOpen }) {
    return (
        <>
            <Dialog open={open || false} TransitionComponent={Transition} keepMounted>
                <DialogTitle>비밀번호 변경 실패</DialogTitle>
                <DialogContent>올바른 비밀번호가 아닙니다.</DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default function UpdatePassDialog({ open, setOpen }) {
    const [invalidOpen, setInvalidOpen] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordAgain: '',
    });
    const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD, {
        onCompleted: (response) => {
            if (response.updateUserPassword === true) {
                axios
                    .post('/api/user/logout')
                    .then(() => (window.location = '/?updatepw=client'))
                    .catch(() => (window.location = '/'));
            } else {
                setOpen(false);
                setInvalidOpen(true);
            }
        },
    });
    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setPasswords({ ...passwords, [name]: value });
        },
        [passwords],
    );
    const onSubmit = () => {
        updateUserPassword({
            variables: {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            },
        });
    };
    return (
        <>
            <InvalidDialog open={invalidOpen} setOpen={setInvalidOpen} />
            <Dialog open={open || false} TransitionComponent={Transition} keepMounted>
                <DialogTitle>비밀번호 변경</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                variant="outlined"
                                required
                                fullWidth
                                name="currentPassword"
                                label="현재 비밀번호"
                                onChange={handleChange}
                                value={passwords.currentPassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                variant="outlined"
                                required
                                fullWidth
                                name="newPassword"
                                label="변경할 비밀번호"
                                onChange={handleChange}
                                value={passwords.newPassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                variant="outlined"
                                required
                                fullWidth
                                name="newPasswordAgain"
                                label="비밀번호 확인"
                                onChange={handleChange}
                                value={passwords.newPasswordAgain}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={onSubmit}
                        disabled={
                            passwords.currentPassword.length > 0 &&
                            passwords.newPassword.length > 0 &&
                            passwords.newPassword === passwords.newPasswordAgain
                                ? false
                                : true
                        }
                    >
                        비밀번호 변경
                    </Button>
                    <Button onClick={() => setOpen(false)} color="primary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
