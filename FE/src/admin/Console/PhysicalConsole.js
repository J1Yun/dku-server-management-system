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
import { GET_CONTAINER_STATUS, POST_CMD_TO_PHYSICAL, DELETE_CONTAINER } from '../../queries';
import SnackMessage from '../../client/components/SnackMessage';
import RefreshIcon from '@material-ui/icons/Refresh';
import CmdAskDialog from './CmdAskDialog';

export default function PhysicalConsole({ hosts, classes, refetch }) {
    const [hostStatus, setHostStatus] = useState([]);
    const { loading, error, data, refetch: refetchStatus } = useQuery(GET_CONTAINER_STATUS);
    const [message, setMessage] = useState('');
    const [hostDialogOpen, setHostDialogOpen] = useState(false);
    const [postCmdToPhysical, { error: errorCmd }] = useMutation(POST_CMD_TO_PHYSICAL);
    const [triggerFunction, setTriggerFunction] = useState(() => () => {});
    const [deleteHost, { error: errorDelete }] = useMutation(DELETE_CONTAINER, {
        onCompleted: () => refetch(),
    });

    useEffect(() => {
        if (data) setHostStatus([...data.getContainerStatus]);
    }, [data, setHostStatus]);

    const getStatus = (id) => {
        const targetStatusData = hostStatus.find((s) => s.id === parseInt(id));
        return targetStatusData ? targetStatusData.status : null;
    };

    const handleRefreshClick = useCallback(() => {
        setTimeout(() => refetchStatus(), 0);
    }, [refetchStatus]);

    const handleHostRebootClick = (e, hostId) => {
        setMessage('물리 서버의 완전한 재부팅에는 약 3분의 시간이 소요됩니다.');
        setTriggerFunction(() => () => triggerHostReboot(hostId));
        setHostDialogOpen(true);
        e.stopPropagation();
    };

    const handleHostDeleteClick = (e, hostId) => {
        setMessage(
            '물리 서버를 삭제합니다. 이는 모두 목록에서만 삭제되는 것으로, 연결 정보를 다시 추가할 수 있습니다.',
        );
        setTriggerFunction(() => () => triggerHostDelete(hostId));
        setHostDialogOpen(true);
        e.stopPropagation();
    };

    const triggerHostReboot = (containerId) => {
        postCmdToPhysical({
            variables: {
                command: 'reboot',
                containerId,
            },
        });
    };

    const triggerHostDelete = (hostId) => {
        deleteHost({
            variables: {
                containerId: hostId,
            },
        });
    };

    if (error)
        return (
            <SnackMessage message="죄송합니다. 데이터 처리 중 에러가 발생했습니다. 잠시 후에 다시 시도해주세요." />
        );
    if (errorCmd || errorDelete)
        return (
            <SnackMessage message="권한 없음 - 요청이 거부되었습니다. 에러메시지가 출력됩니다." />
        );

    return (
        <>
            <TableContainer className={classes.tableWrapper} component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">서버 ID</TableCell>
                            <TableCell align="center">서버 이름</TableCell>
                            <TableCell align="center">IP</TableCell>
                            <TableCell align="center">CPU</TableCell>
                            <TableCell align="center">RAM</TableCell>
                            <TableCell align="center">위치</TableCell>
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
                            <TableCell align="center" width={150}>
                                작업
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {hosts.map((row) => (
                            <TableRow key={row.id} className={classes.physicalConsoleTableRow}>
                                <TableCell align="center" component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell align="center">{row.host}</TableCell>
                                <TableCell align="center">{row.cpu}</TableCell>
                                <TableCell align="center">{row.ram}GB</TableCell>
                                <TableCell align="center">{row.location}</TableCell>
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
                                                handleHostRebootClick(e, parseInt(row.id))
                                            }
                                        >
                                            재부팅
                                        </Button>
                                        <Button
                                            size="small"
                                            color="secondary"
                                            variant="outlined"
                                            style={{ marginLeft: 4 }}
                                            onClick={(e) =>
                                                handleHostDeleteClick(e, parseInt(row.id))
                                            }
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
                setHostDialogOpen={setHostDialogOpen}
                hostDialogOpen={hostDialogOpen}
                message={message}
                triggerFunction={triggerFunction}
            />
        </>
    );
}
