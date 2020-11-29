import React, { useState, useCallback } from 'react';
import { useMutation } from 'react-apollo';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    TextField,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@material-ui/core';
import { POST_CONTAINER } from '../../queries';
import FinishApplyDialog from '../FinishApplyDialog';
import { serverOS } from './serverConf';

export default function AddContainerDialog({
    refetch,
    setContainerDialogOpen,
    selectedHost,
    containerDialogOpen,
}) {
    const [container, setContainer] = useState({
        name: '',
        os: '',
        password: '',
    });

    const [dialogInfo, setDialogInfo] = useState({
        title: '',
        content: '',
        open: false,
    });
    const [postContainer] = useMutation(POST_CONTAINER, {
        onCompleted: () => {
            setDialogInfo({
                title: '컨테이너 등록이 완료되었습니다.',
                open: true,
            });
            refetch();
        },
    });
    const handleChange = useCallback(
        (e) => {
            const { name, value } = e.target;
            setContainer({ ...container, [name]: value });
        },
        [container],
    );
    const onSubmit = (e) => {
        e.preventDefault();
        postContainer({
            variables: {
                hostId: selectedHost.id,
                container: {
                    ...container,
                },
            },
        });
    };

    return (
        <>
            {selectedHost && (
                <Dialog open={containerDialogOpen} keepMounted>
                    <form onSubmit={onSubmit} noValidate>
                        <DialogTitle>
                            <Box display="flex" flexDirection="row" justify="center">
                                <span style={{ flex: 1 }}>컨테이너 추가</span>
                                <Button
                                    onClick={() => setContainerDialogOpen(false)}
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
                                        container.os.length > 0 &&
                                        container.name.length > 0 &&
                                        container.password.length > 0
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
                                    <Typography variant="subtitle1">
                                        호스트 서버 이름: {selectedHost.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">
                                        호스트 IP: {selectedHost.host}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        variant="outlined"
                                        label="컨테이너 이름"
                                        onChange={handleChange}
                                        value={container.name}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl variant="outlined" fullWidth required>
                                        <InputLabel>운영체제 선택</InputLabel>
                                        <Select
                                            name="os"
                                            value={container.os}
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
                                        type="password"
                                        name="password"
                                        variant="outlined"
                                        value={container.password}
                                        label="비밀번호"
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                            </Grid>
                            <FinishApplyDialog
                                dialogInfo={dialogInfo}
                                setDialogInfo={setDialogInfo}
                                setHostDialogOpen={setContainerDialogOpen}
                            />
                        </DialogContent>
                    </form>
                </Dialog>
            )}
        </>
    );
}
