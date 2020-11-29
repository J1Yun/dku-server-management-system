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

export default function ContainerConsole({ containers, classes }) {
    return (
        <TableContainer className={classes.tableWrapper} component={Paper}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell align="center">인스턴스ID</TableCell>
                        <TableCell align="center">인스턴스 이름</TableCell>
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
