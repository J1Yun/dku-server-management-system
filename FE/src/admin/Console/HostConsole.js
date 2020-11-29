import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@material-ui/core';
import StatusCircle from './StatusCircle';

export default function HostConsole({ hosts, classes, handleOpenContainerConsole }) {
    return (
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
                            <TableCell align="center">{row.ram}GB</TableCell>
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
    );
}
