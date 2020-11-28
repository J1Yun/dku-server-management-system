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
    Typography,
    Button,
    Divider,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackMessage from '../client/components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { POST_HOST, GET_HOSTS, GET_CONTAINERS, POST_CONTAINER } from '../queries';
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
}));

function StatusCircle({ color }) {
    return <FiberManualRecordIcon style={{ color }} />;
}

function AddHostDialog({ refetch, setHostDialogOpen }) {
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

function AddContainerDialog({ refetch, setContainerDialogOpen, selectedHost }) {
    const classes = useStyles();
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
                selectedHost,
                container,
            },
        });
    };

    const serverOS = ['Ubuntu 20.04', 'Ubuntu 18.04', 'CentOS 8'];
    return (
        <form className={classes.form} onSubmit={onSubmit} noValidate>
            <Grid item xs={12}>
                <Typography variant="subtitle1">호스트 서버명: {selectedHost.name}</Typography>
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
            <Button type="submit" className={classes.submit} variant="outlined" color="primary">
                추가
            </Button>
            <FinishApplyDialog
                dialogInfo={dialogInfo}
                setDialogInfo={setDialogInfo}
                setHostDialogOpen={setContainerDialogOpen}
            />
        </form>
    );
}

export default function Console() {
    const classes = useStyles();
    const [hostConsoleOpen, setHostConsoleOpen] = useState(true);
    const [selectedHost, setSelectedHost] = useState({});
    const [hosts, setHosts] = useState([]);
    const { loading, error, data, refetch } = useQuery(GET_HOSTS);
    const [hostDialogOpen, setHostDialogOpen] = useState(false);
    const [containerDialogOpen, setContainerDialogOpen] = useState(false);
    const [containers, setContainers] = useState([]);

    const handleOpenContainerConsole = useCallback((host) => {
        setHostConsoleOpen(false);
        setSelectedHost({ ...host });
    }, []);
    const { loading: loadingContainer, error: errorContainer, data: dataContainer } = useQuery(
        GET_CONTAINERS,
        {
            variables: {
                hostId: parseInt(selectedHost.id) || null,
            },
        },
    );
    useEffect(() => {
        if (data) {
            setHosts(
                data.getHosts.map((h) => {
                    return { ...h, ram: `${h.ram}GB` };
                }),
            );
        }
    }, [data, setHosts]);

    useEffect(() => {
        if (dataContainer) {
            setContainers(dataContainer.getContainers);
        }
    }, [dataContainer, setContainers]);

    if (loading) return <CircularProgress />;
    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    if (loadingContainer) return <CircularProgress />;
    if (errorContainer)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );
    return (
        <div>
            {hostConsoleOpen && (
                <>
                    <PageTitle title="호스트 관리" />
                    <Dialog open={hostDialogOpen} keepMounted>
                        <DialogTitle>
                            호스트 추가
                            <Button
                                onClick={() => setHostDialogOpen(false)}
                                variant="outlined"
                                color="secondary"
                            >
                                취소
                            </Button>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <AddHostDialog
                                refetch={refetch}
                                setHostDialogOpen={setHostDialogOpen}
                            />
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
                        호스트 추가
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
                                    <TableRow
                                        key={row.id}
                                        onClick={() => handleOpenContainerConsole(row)}
                                        style={{ cursor: 'pointer' }}
                                    >
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
                </>
            )}
            {!hostConsoleOpen && containers.length > 0 && (
                <>
                    <PageTitle title={`컨테이너 관리 (호스트: ${selectedHost.name})`} />
                    <Button
                        onClick={() => setHostConsoleOpen(true)}
                        variant="outlined"
                        color="secondary"
                        size="small"
                    >
                        호스트 관리로 돌아가기
                    </Button>
                    {/* 컨테이너 추가에 들어갈 내용
                    호스트 name, host,
                    name, os */}
                    <Dialog open={containerDialogOpen} keepMounted>
                        <DialogTitle>
                            컨테이너 추가
                            <Button
                                className={classes.buttonSection}
                                onClick={() => setContainerDialogOpen(false)}
                                variant="outlined"
                                color="secondary"
                            >
                                취소
                            </Button>
                        </DialogTitle>
                        <Divider />
                        <DialogContent>
                            <AddContainerDialog
                                refetch={refetch}
                                setContainerDialogOpen={setContainerDialogOpen}
                                selectedHost={selectedHost}
                            />
                        </DialogContent>
                    </Dialog>
                    <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                            setContainerDialogOpen(true);
                        }}
                    >
                        컨테이너 추가
                    </Button>
                    <TableContainer className={classes.tableWrapper} component={Paper}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">인스턴스ID</TableCell>
                                    <TableCell align="center">인스턴스명</TableCell>
                                    <TableCell align="center">HOST</TableCell>
                                    <TableCell align="center">PORT</TableCell>
                                    <TableCell align="center">OS</TableCell>
                                    <TableCell align="center">CPU</TableCell>
                                    <TableCell align="center">RAM</TableCell>
                                    <TableCell align="center">패스워드</TableCell>
                                    <TableCell align="center">가동상태</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {containers.map((row) => (
                                    <TableRow key={row.id} onClick={() => console.log(row.id)}>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{row.instanceName}</TableCell>
                                        <TableCell align="center">{row.host}</TableCell>
                                        <TableCell align="center">{row.port}</TableCell>
                                        <TableCell align="center">{row.os}</TableCell>
                                        <TableCell align="center">{row.cpu}</TableCell>
                                        <TableCell align="center">{row.ram}GB</TableCell>
                                        <TableCell align="center">{row.password}</TableCell>
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
                </>
            )}
        </div>
    );
}
