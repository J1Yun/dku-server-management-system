import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    TextField,
    Button,
    Divider,
    CircularProgress,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackMessage from '../client/components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { POST_HOST, GET_HOSTS } from '../queries';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import FinishApplyDialog from './FinishApplyDialog';
const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(1),
    },
    table: {
        minWidth: 500,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
    buttonSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

function StatusCircle({ color }) {
    return <FiberManualRecordIcon style={{ color }} />;
}

function AddHost({ refetch, setHostDialogOpen }) {
    const classes = useStyles();
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
        <form className={classes.form} onSubmit={onSubmit} noValidate>
            <Grid item xs={12}>
                <TextField
                    name="name"
                    variant="outlined"
                    label="서버명"
                    onChange={handleChange}
                    multiline
                    fullWidth
                    required
                />
                <TextField
                    name="host"
                    variant="outlined"
                    label="호스트 IP"
                    onChange={handleChange}
                    multiline
                    fullWidth
                    required
                />
                <TextField
                    name="port"
                    variant="outlined"
                    label="포트"
                    onChange={handleChange}
                    multiline
                    fullWidth
                    required
                />
                <TextField
                    name="password"
                    variant="outlined"
                    label="비밀번호"
                    onChange={handleChange}
                    multiline
                    fullWidth
                    required
                />
                <TextField
                    name="cpu"
                    variant="outlined"
                    label="CPU"
                    onChange={handleChange}
                    multiline
                    fullWidth
                    required
                />
                <TextField
                    name="ram"
                    variant="outlined"
                    label="RAM"
                    onChange={handleChange}
                    multiline
                    fullWidth
                    required
                />
                <TextField
                    name="location"
                    variant="outlined"
                    label="위치"
                    onChange={handleChange}
                    multiline
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

export default function Console() {
    const classes = useStyles();
    const [hosts, setHosts] = useState([]);
    const { loading, error, data, refetch } = useQuery(GET_HOSTS);
    const [hostDialogOpen, setHostDialogOpen] = useState(false);
    useEffect(() => {
        if (data) {
            setHosts(
                data.getHosts.map((h) => {
                    return { ...h, ram: `${h.ram}GB` };
                }),
            );
        }
    }, [data, setHosts]);

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <div>
            <PageTitle title="호스트" />
            <Dialog open={hostDialogOpen} keepMounted>
                <DialogTitle>
                    호스트 추가
                    <Button
                        className={classes.buttonSection}
                        onClick={() => setHostDialogOpen(false)}
                        variant="outlined"
                        color="secondary"
                    >
                        취소
                    </Button>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <AddHost refetch={refetch} setHostDialogOpen={setHostDialogOpen} />
                </DialogContent>
            </Dialog>
            <Button
                size="small"
                color="primary"
                variant="outlined"
                onClick={() => {
                    setHostDialogOpen(true);
                }}
            >
                호스트추가
            </Button>
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">서버ID</TableCell>
                            <TableCell align="center">서버명</TableCell>
                            <TableCell align="center">IP</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">위치</TableCell>
                            <TableCell align="center">가동상태</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hosts.map((row) => (
                            <TableRow key={row.id} onClick={() => console.log(row.id)}>
                                <TableCell align="center" component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.host}</TableCell>
                                <TableCell align="center">{row.cpu}</TableCell>
                                <TableCell align="center">{row.ram}</TableCell>
                                <TableCell align="center">{row.location}</TableCell>
                                <TableCell align="center">
                                    {1 === 0 ? (
                                        <StatusCircle color="green" />
                                    ) : (
                                        <StatusCircle color="crimson" />
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
