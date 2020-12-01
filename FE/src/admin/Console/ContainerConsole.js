import React, { useState, useEffect, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
    Box,
} from '@material-ui/core';
import StatusCircle from './StatusCircle';
import { useQuery, useMutation } from 'react-apollo';
import {
    GET_CONTAINER_STATUS,
    POST_CMD_TO_CONTAINER_VIA_HOST_USING_DOCKER,
    POST_INIT_CONTAINER,
} from '../../queries';
import SnackMessage from '../../client/components/SnackMessage';
import RefreshIcon from '@material-ui/icons/Refresh';
import CmdAskDialog from './CmdAskDialog';

export default function ContainerConsole({ containers, classes }) {
    const [containerStatus, setContainerStatus] = useState([]);
    const { loading, error, data, refetch: refetchStatus } = useQuery(GET_CONTAINER_STATUS);
    const [message, setMessage] = useState('');
    const [triggerFunction, setTriggerFunction] = useState(() => () => {});
    const [containerDialogOpen, setContainerDialogOpen] = useState(false);
    const [postCmdToContainerViaHostUsingDocker, { error: errorCmd }] = useMutation(
        POST_CMD_TO_CONTAINER_VIA_HOST_USING_DOCKER,
    );
    const [postInitContainer, { error: errorInit }] = useMutation(POST_INIT_CONTAINER);

    useEffect(() => {
        if (data) setContainerStatus([...data.getContainerStatus]);
    }, [data, setContainerStatus]);

    const getStatus = (id) => {
        const targetStatusData = containerStatus.find((s) => s.id === parseInt(id));
        return targetStatusData ? targetStatusData.status : null;
    };

    const handleRefreshClick = useCallback(() => {
        setTimeout(() => refetchStatus(), 0);
    }, [refetchStatus]);

    const handleContainerRestartClick = (e, containerId) => {
        setMessage(
            '컨테이너를 재시작하면 사용 중인 클라이언트의 작업에 치명적인 피해를 야기할 수 있습니다. 완전한 작업 완료에 약 10초의 시간이 소요됩니다.',
        );
        setTriggerFunction(() => () => triggerContainerRestart(containerId));
        setContainerDialogOpen(true);
        e.stopPropagation();
    };

    const handleContainerInitClick = (e, containerId) => {
        setMessage(
            '초기화시 컨테이너 내의 모든 내용, 설정이 삭제됩니다.완전한 작업 완료에 약 10초의 시간이 소요됩니다.',
        );
        setTriggerFunction(() => () => triggerContainerInit(containerId));
        setContainerDialogOpen(true);
        e.stopPropagation();
    };

    const triggerContainerRestart = (containerId) => {
        postCmdToContainerViaHostUsingDocker({
            variables: {
                command: 'restart',
                containerId,
            },
        });
    };

    const triggerContainerInit = (containerId) => {
        postInitContainer({
            variables: {
                containerId,
            },
        });
    };

    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );

    if (errorCmd || errorInit)
        return (
            <SnackMessage message="권한 없음 - 요청이 거부되었습니다. 에러메시지가 출력됩니다." />
        );

    return (
        <>
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">컨테이너 ID</TableCell>
                            <TableCell align="center">컨테이너 이름</TableCell>
                            <TableCell align="center">Host IP</TableCell>
                            <TableCell align="center">PORT</TableCell>
                            <TableCell align="center">OS</TableCell>
                            <TableCell align="center">vCPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">패스워드</TableCell>
                            <TableCell align="center">
                                {'상태 '}
                                {loading && (
                                    <CircularProgress style={{ width: '14px', height: '14px' }} />
                                )}
                                <RefreshIcon
                                    style={{ fontSize: '14px', cursor: 'pointer' }}
                                    onClick={handleRefreshClick}
                                />
                            </TableCell>
                            <TableCell align="center" width={210}>
                                작업
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {containers.length > 0 &&
                            containers.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="center">{row.instanceName}</TableCell>
                                    <TableCell align="center">{row.host}</TableCell>
                                    <TableCell align="center">{row.port}</TableCell>
                                    <TableCell align="center">{row.os}</TableCell>
                                    <TableCell align="center">{row.cpu}</TableCell>
                                    <TableCell align="center">{row.ram}GB</TableCell>
                                    <TableCell align="center">{row.password}</TableCell>
                                    <TableCell align="center">
                                        {getStatus(row.id) === 1 ? (
                                            <StatusCircle color="green" />
                                        ) : (
                                            <StatusCircle color="crimson" />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box display="flex" flexDirection="row" justify="center">
                                            <Button
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                                onClick={(e) =>
                                                    handleContainerRestartClick(e, parseInt(row.id))
                                                }
                                            >
                                                재시작
                                            </Button>
                                            <Button
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                                style={{ marginLeft: 4 }}
                                                onClick={(e) =>
                                                    handleContainerInitClick(e, parseInt(row.id))
                                                }
                                            >
                                                초기화
                                            </Button>
                                            <Button
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                                style={{ marginLeft: 4 }}
                                            >
                                                삭제
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CmdAskDialog
                setHostDialogOpen={setContainerDialogOpen}
                hostDialogOpen={containerDialogOpen}
                message={message}
                triggerFunction={triggerFunction}
            />
        </>
    );
}
