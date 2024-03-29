import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { Button, CircularProgress, Box, Divider } from '@material-ui/core';
import SnackMessage from '../client/components/SnackMessage';
import PageTitle from '../components/PageTitle';
import { GET_HOSTS, GET_CONTAINERS, GET_PHYSICALS } from '../queries';

import HostConsole from './Console/HostConsole';
import ContainerConsole from './Console/ContainerConsole';
import AddHostDialog from './Console/AddHostDialog';
import AddContainerDialog from './Console/AddContainerDialog';

import { useStyles } from './Console/ConsoleStyle';
import PhysicalConsole from './Console/PhysicalConsole';
import AddPhysicalDialog from './Console/AddPhysicalDialog';

export default function Console() {
    const classes = useStyles();
    const [hostConsoleOpen, setHostConsoleOpen] = useState(true);
    const [selectedHost, setSelectedHost] = useState({});
    const [hosts, setHosts] = useState([]);
    const [physicals, setPhysicals] = useState([]);
    const { loading, error, data, refetch } = useQuery(GET_HOSTS);
    const { loading: phLoading, error: phError, data: phData, refetch: phRefetch } = useQuery(
        GET_PHYSICALS,
    );
    const [physicalDialogOpen, setPhysicalDialogOpen] = useState(false);
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
            setHosts(data.getHosts);
        }
    }, [data, setHosts]);
    useEffect(() => {
        if (phData) {
            setPhysicals(phData.getPhysicals);
        }
    }, [phData, setPhysicals]);
    useEffect(() => {
        if (dataContainer) {
            setContainers(dataContainer.getContainers);
        }
    }, [dataContainer, setContainers]);

    if (loading || phLoading || loadingContainer) return <CircularProgress />;
    if (error || phError || errorContainer)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    return (
        <>
            {hostConsoleOpen && (
                <>
                    <PageTitle title="호스트 콘솔" />
                    <Divider />
                    <PageTitle title="물리 서버" />
                    <AddPhysicalDialog
                        refetch={phRefetch}
                        setHostDialogOpen={setPhysicalDialogOpen}
                        hostDialogOpen={physicalDialogOpen}
                    />
                    <Box display="flex" flexDirection="row" justify="center" m={1}>
                        <span style={{ flex: 1, color: '#666' }}>
                            물리 서버는 OS를 가상화하지 않습니다. 서버 전체를 사용자에게 대여합니다.
                        </span>
                        <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                setPhysicalDialogOpen(true);
                            }}
                        >
                            물리서버 추가
                        </Button>
                    </Box>
                    <PhysicalConsole hosts={physicals} classes={classes} refetch={phRefetch} />
                    {physicals.length === 0 && (
                        <SnackMessage message="등록된 물리 서버가 없습니다. 서버를 추가하세요." />
                    )}
                    <Divider style={{ marginTop: 30 }} />
                    <PageTitle title="호스트 서버 (가상화)" />
                    <AddHostDialog
                        refetch={refetch}
                        setHostDialogOpen={setHostDialogOpen}
                        hostDialogOpen={hostDialogOpen}
                    />
                    <Box display="flex" flexDirection="row" justify="center" m={1}>
                        <span style={{ flex: 1, color: '#666' }}>
                            호스트를 클릭하여 호스트에 연결된 컨테이너 콘솔로 이동할 수 있습니다.
                        </span>
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
                    </Box>
                    <HostConsole
                        hosts={hosts}
                        classes={classes}
                        handleOpenContainerConsole={handleOpenContainerConsole}
                        refetch={refetch}
                    />
                    {hosts.length === 0 && (
                        <SnackMessage message="등록된 호스트 서버가 없습니다. 호스트를 추가하세요." />
                    )}
                </>
            )}
            {!hostConsoleOpen && (
                <>
                    <PageTitle title={`컨테이너 콘솔 (호스트: ${selectedHost.name})`} />
                    <Box display="flex" flexDirection="row-reverse" justify="center">
                        <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            onClick={() => {
                                setContainerDialogOpen(true);
                            }}
                            style={{ marginLeft: 5 }}
                        >
                            컨테이너 추가
                        </Button>
                        <Button
                            onClick={() => setHostConsoleOpen(true)}
                            variant="outlined"
                            color="secondary"
                            size="small"
                        >
                            호스트 콘솔로 돌아가기
                        </Button>
                    </Box>
                    <AddContainerDialog
                        refetch={refetchContainer}
                        setContainerDialogOpen={setContainerDialogOpen}
                        selectedHost={selectedHost}
                        containerDialogOpen={containerDialogOpen}
                    />
                    <ContainerConsole
                        containers={containers}
                        classes={classes}
                        refetch={refetchContainer}
                    />
                    {containers.length === 0 && (
                        <SnackMessage message="등록된 컨테이너가 없습니다. 컨테이너를 추가하세요." />
                    )}
                </>
            )}
        </>
    );
}
