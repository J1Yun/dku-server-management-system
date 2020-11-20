import React, { useState, useCallback } from 'react';
import { Button } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useMutation } from 'react-apollo';
import { UPDATE_RETURN_APPLY } from '../../queries';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function ReturnConfirmDialog({ id, open, setOpen, refetch }) {
    const [completedOpen, setCompletedOpen] = useState(false);
    const [updateReservationApply] = useMutation(UPDATE_RETURN_APPLY, {
        onCompleted: () => {
            handleCloseClick();
            setCompletedOpen(true);
            refetch();
        },
    });

    const handleCloseClick = useCallback(() => {
        const array = open.slice().fill(false);
        setOpen(array);
    }, [open, setOpen]);

    const triggerUpdate = useCallback(
        (applyOk) => {
            updateReservationApply({
                variables: { id, applyOk },
            });
        },
        [id, updateReservationApply],
    );

    return (
        <div>
            <Dialog open={completedOpen || false} TransitionComponent={Transition} keepMounted>
                <DialogTitle>처리되었습니다.</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setCompletedOpen(false)} variant="outlined">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open[id] || false} TransitionComponent={Transition} keepMounted>
                <DialogTitle>반납을 승인 처리하시겠습니까?</DialogTitle>
                <DialogActions>
                    <Button color="secondary" variant="outlined" onClick={() => triggerUpdate(2)}>
                        거부
                    </Button>
                    <Button color="primary" variant="outlined" onClick={() => triggerUpdate(1)}>
                        승인
                    </Button>
                    <Button onClick={handleCloseClick} variant="outlined">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
