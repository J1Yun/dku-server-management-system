import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Divider, CircularProgress } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackMessage from '../client/components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { GET_HOSTS, GET_CONTAINERS } from '../queries';

import HostConsole from './Console/HostConsole';
import ContainerConsole from './Console/ContainerConsole';
import AddHostDialog from './Console/AddContainerDialog';
import AddContainerDialog from './Console/AddContainerDialog';

const useStyles = makeStyles((theme) => ({
    tableWrapper: {
        marginTop: theme.spacing(1.5),
    },
    table: {
        minWidth: 500,
        '& .MuiTableCell-root': {
            padding: 10,
        },
    },
}));

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
    const {
        loading: loadingContainer,
        error: errorContainer,
        data: dataContainer,
        refetch: refetchContainer,
    } = useQuery(GET_CONTAINERS, {
        variables: {
            hostId: parseInt(selectedHost.id) || null,
        },
    });
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
        <>
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
                    <HostConsole
                        hosts={hosts}
                        classes={classes}
                        handleOpenContainerConsole={handleOpenContainerConsole}
                    />
                    {hosts.length === 0 && (
                        <SnackMessage message="등록된 호스트 서버가 없습니다. 호스트를 추가하세요." />
                    )}
                </>
            )}
            {!hostConsoleOpen && (
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
                                refetch={refetchContainer}
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
                    <ContainerConsole containers={containers} classes={classes} />
                    {containers.length === 0 && (
                        <SnackMessage message="등록된 컨테이너가 없습니다. 컨테이너를 추가하세요." />
                    )}
                </>
            )}
        </>
    );
}
