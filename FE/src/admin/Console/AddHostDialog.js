import React, { useState, useCallback } from 'react';
import { Grid, TextField, Button } from '@material-ui/core';
import { POST_HOST } from '../../queries';

export default function AddHostDialog({ refetch, setHostDialogOpen }) {
    const [host, setHost] = useState([]);
    const [open, setOpen] = useState(false);

    const [dialogInfo, setDialogInfo] = useState({
        title: '',
        content: '',
        open: false,
    });
    const [postHost] = useMutation(POST_HOST, {
        onCompleted: () => {
            setOpen(false);
            setDialogInfo({
                title: '호스트 등록이 완료되었습니다.',
                open: true,
            });
            refetch();
        },
    });
    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            if (name === 'cpu' || name === 'ram') {
                setHost({ ...host, [name]: parseInt(value) });
            } else setHost({ ...host, [name]: value });
        },
        [host],
    );
    const onSubmit = (e) => {
        e.preventDefault();
        setOpen(true);
        postHost({
            variables: {
                host,
            },
        });
    };
    return (
        <form onSubmit={onSubmit} noValidate>
            <Grid item xs={12}>
                <TextField
                    name="name"
                    variant="outlined"
                    label="서버명"
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="host"
                    variant="outlined"
                    label="호스트 IP"
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="port"
                    variant="outlined"
                    label="포트"
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="password"
                    variant="outlined"
                    label="비밀번호"
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    type="number"
                    name="cpu"
                    variant="outlined"
                    label="CPU"
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    type="number"
                    name="ram"
                    variant="outlined"
                    label="RAM"
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <TextField
                    name="location"
                    variant="outlined"
                    label="위치"
                    onChange={handleChange}
                    fullWidth
                    required
                />
            </Grid>
            <Button type="submit" className={classes.submit} variant="outlined" color="primary">
                추가
            </Button>
            <FinishApplyDialog
                dialogInfo={dialogInfo}
                setDialogInfo={setDialogInfo}
                setHostDialogOpen={setHostDialogOpen}
            />
        </form>
    );
}
