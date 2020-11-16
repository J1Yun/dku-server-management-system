import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import SnackMessage from "./components/SnackMessage";

const useStyles = makeStyles((theme) => ({
  tableWrapper: {
    marginTop: theme.spacing(5),
  },
  table: {
    minWidth: 500,
    "& .MuiTableCell-root": {
      padding: 10,
    },
  },
}));

function createData(id, os, cpu, ram, status) {
  return { id, os, cpu, ram: `${ram}GB`, status };
}

const rows = [
  createData(1, "Ubuntu 18.04", 1, 1, 0),
  createData(2, "Ubuntu 18.04", 4, 1, 1),
  createData(3, "CentOS 7.5", 4, 1, 1),
  createData(4, "CentOS 7.5", 8, 1, 0),
  createData(5, "Devian 10", 4, 1, 1),
  createData(6, "Ubuntu 20.04 LTS", 4, 1, 0),
  createData(7, "Ubuntu 16.04 LTS", 8, 1, 1),
  createData(8, "Windows 2019 STD", 8, 1, 0),
];

function StatusCircle({ color }) {
  return <FiberManualRecordIcon style={{ color }}>●</FiberManualRecordIcon>;
}

export default function ServerStatus() {
  const classes = useStyles();

  return (
    <div>
      <SnackMessage message="단국대학교 서버관리시스템에 접속하신 것을 환영합니다. 사용 목적에 적합한 서버를 확인 후 선택하여 예약하시면 승인을 도와드리겠습니다." />
      <TableContainer className={classes.tableWrapper} component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">서버ID</TableCell>
              <TableCell align="center">OS</TableCell>
              <TableCell align="center">CPU</TableCell>
              <TableCell align="center">RAM</TableCell>
              <TableCell align="center">가동상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell align="center" component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.os}</TableCell>
                <TableCell align="center">{row.cpu}</TableCell>
                <TableCell align="center">{row.ram}</TableCell>
                <TableCell align="center">
                  {row.status === 0 ? (
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
