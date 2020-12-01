import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    Button,
    Box,
} from '@material-ui/core';
import FinishApplyDialog from '../FinishApplyDialog';

export default function CmdAskDialog({
    setHostDialogOpen,
    hostDialogOpen,
    message,
    triggerFunction,
}) {
    const [dialogInfo, setDialogInfo] = useState({
        title: '',
        content: '',
        open: false,
    });
    const [userInputValue, setUserInputValue] = useState('');
    const handleChange = useCallback((e) => {
        setUserInputValue(e.target.value);
    }, []);
    const handleClick = useCallback(() => {
        setHostDialogOpen(false);
        triggerFunction();
        setDialogInfo({
            ...dialogInfo,
            title: '작업이 요청되었습니다.',
            content: '완전한 작업 완료까지 일정 시간이 소요됩니다.',
            open: true,
        });
    }, [setHostDialogOpen, triggerFunction, dialogInfo]);
    return (
        <>
            <Dialog open={hostDialogOpen || false} keepMounted>
                <DialogTitle>
                    <Box display="flex" flexDirection="row" justify="center">
                        <span style={{ flex: 1 }}>작업을 요청할까요?</span>
                        <Button
                            onClick={() => setHostDialogOpen(false)}
                            variant="outlined"
                            color="secondary"
                        >
                            취소
                        </Button>
                    </Box>
                </DialogTitle>
                <Divider />
                <DialogContent style={{ padding: 20 }}>
                    <p>{message}</p>
                    <p>
                        아래 필드에 <b>작업을 요청함</b>을 직접 입력하세요. 요청한 작업은 취소할 수
                        없습니다.
                    </p>
                    <Box display="flex" flexDirection="row" justify="center">
                        <TextField
                            label="직접 입력"
                            variant="outlined"
                            placeholder="작업을 요청함"
                            style={{ flex: 2 }}
                            value={userInputValue}
                            onChange={handleChange}
                            size="small"
                        />
                        <Button
                            onClick={handleClick}
                            variant="outlined"
                            color="secondary"
                            style={{ flex: 1, fontSize: 15, marginLeft: 5 }}
                            disabled={userInputValue === '작업을 요청함' ? false : true}
                            size="small"
                        >
                            작업 요청
                        </Button>
                    </Box>
                    <FinishApplyDialog
                        dialogInfo={dialogInfo}
                        setDialogInfo={setDialogInfo}
                        setHostDialogOpen={setHostDialogOpen}
                    />
                </DialogContent>
            </Dialog>
            <FinishApplyDialog
                dialogInfo={dialogInfo}
                setDialogInfo={setDialogInfo}
                setHostDialogOpen={setHostDialogOpen}
            />
        </>
    );
}
