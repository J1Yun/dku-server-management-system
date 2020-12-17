import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@material-ui/core';
import { useMutation } from 'react-apollo';
import { POST_PHYSICAL } from '../../queries';
import FinishApplyDialog from '../FinishApplyDialog';
import { serverOS } from './serverConf';

export default function AddPhysicalDialog({ refetch, setHostDialogOpen, hostDialogOpen }) {
    const [host, setHost] = useState({
        name: '',
        host: '',
        port: '22',
        os: '',
        password: '',
        cpu: 0,
        ram: 0,
        location: '',
    });

    const [dialogInfo, setDialogInfo] = useState({
        title: '',
        content: '',
        open: false,
    });
    const [postHost] = useMutation(POST_PHYSICAL, {
        onCompleted: () => {
            setDialogInfo({
                title: '물리 서버 등록이 완료되었습니다.',
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
        setHostDialogOpen(false);
        postHost({
            variables: {
                host,
            },
        });
    };

    return (
        <Dialog open={hostDialogOpen || false} keepMounted>
            <form onSubmit={onSubmit} noValidate>
                <DialogTitle>
                    <Box display="flex" flexDirection="row" justify="center">
                        <span style={{ flex: 1 }}>물리서버 추가</span>
                        <Button
                            onClick={() => setHostDialogOpen(false)}
                            variant="outlined"
                            color="secondary"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="primary"
                            style={{ marginLeft: 5 }}
                            disabled={
                                host.name.length > 0 &&
                                host.host.length > 0 &&
                                host.port > 0 &&
                                host.password.length > 0 &&
                                host.cpu > 0 &&
                                host.ram > 0 &&
                                host.location.length > 0
                                    ? false
                                    : true
                            }
                        >
                            추가
                        </Button>
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent style={{ padding: 20 }}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                name="name"
                                variant="outlined"
                                value={host.name}
                                label="서버 이름"
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="host"
                                variant="outlined"
                                value={host.host}
                                label="IP"
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="number"
                                name="port"
                                variant="outlined"
                                value={host.port}
                                label="포트 (기본 22)"
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="password"
                                variant="outlined"
                                label="패스워드"
                                value={host.password}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl variant="outlined" fullWidth required>
                                <InputLabel>운영체제 선택</InputLabel>
                                <Select
                                    name="os"
                                    value={host.os}
                                    onChange={handleChange}
                                    label="운영체제 선택"
                                    required
                                >
                                    <MenuItem value="">
                                        <em>운영체제 선택</em>
                                    </MenuItem>
                                    {serverOS.map((os, idx) => (
                                        <MenuItem key={idx} value={os}>
                                            {os}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="number"
                                name="cpu"
                                variant="outlined"
                                label="CPU"
                                value={host.cpu}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="number"
                                name="ram"
                                variant="outlined"
                                value={host.ram}
                                label="RAM"
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="location"
                                variant="outlined"
                                value={host.location}
                                label="위치"
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                    </Grid>
                    <FinishApplyDialog
                        dialogInfo={dialogInfo}
                        setDialogInfo={setDialogInfo}
                        setHostDialogOpen={setHostDialogOpen}
                    />
                </DialogContent>
            </form>
        </Dialog>
    );
}
