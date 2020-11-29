import React, { useState, useCallback } from 'react';
import { useMutation } from 'react-apollo';
import {
    Grid,
    TextField,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import { POST_CONTAINER } from '../../queries';
import FinishApplyDialog from '../FinishApplyDialog';

export default function AddContainerDialog({ refetch, setContainerDialogOpen, selectedHost }) {
    const [container, setContainer] = useState({
        name: '',
        os: '',
        password: '',
    });
    const [open, setOpen] = useState(false);

    const [dialogInfo, setDialogInfo] = useState({
        title: '',
        content: '',
        open: false,
    });
    const [postContainer] = useMutation(POST_CONTAINER, {
        onCompleted: () => {
            setOpen(false);
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
        setOpen(true);
        postContainer({
            variables: {
                hostId: selectedHost.id,
                container: {
                    ...container,
                },
            },
        });
    };

    const serverOS = ['Ubuntu 20.04', 'Ubuntu 18.04', 'CentOS 8'];

    return (
        <>
            {selectedHost && (
                <form onSubmit={onSubmit} noValidate>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            호스트 서버명: {selectedHost.name}
                        </Typography>
                        <Typography variant="subtitle1">호스트 IP: {selectedHost.host}</Typography>
                        <TextField
                            name="name"
                            variant="outlined"
                            label="컨테이너 이름"
                            onChange={handleChange}
                            value={container.name}
                            fullWidth
                            required
                        />
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
                        <TextField
                            type="password"
                            name="password"
                            variant="outlined"
                            label="비밀번호"
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Button type="submit" variant="outlined" color="primary">
                        추가
                    </Button>
                    <FinishApplyDialog
                        dialogInfo={dialogInfo}
                        setDialogInfo={setDialogInfo}
                        setHostDialogOpen={setContainerDialogOpen}
                    />
                </form>
            )}
        </>
    );
}
