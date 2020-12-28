import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PrivacyContent from './PrivacyContent';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PrivacyDialog({ open, setOpen, setPrivacyChecked }) {
    return (
        <div>
            <Dialog open={open || false} TransitionComponent={Transition} keepMounted>
                <DialogTitle>개인정보처리방침</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ width: 500, height: 300, color: 'black' }}>
                        <PrivacyContent />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            setPrivacyChecked(false);
                        }}
                        color="secondary"
                    >
                        동의하지 않음
                    </Button>
                    <Button
                        onClick={() => {
                            setOpen(false);
                            setPrivacyChecked(true);
                        }}
                        color="primary"
                    >
                        동의함
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
