import React, { useState } from "react";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@material-ui/core";
import moment from "moment";

const useRowStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  tableWrapper: {
    marginTop: theme.spacing(5),
  },
}));

function createData(applyDate, startDate, endDate, os, applyOk, history) {
  return {
    applyDate,
    startDate,
    endDate,
    os,
    applyOk,
    history,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell align="center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {row.applyDate}
        </TableCell>
        <TableCell align="center">{row.startDate}</TableCell>
        <TableCell align="center">{row.endDate}</TableCell>
        <TableCell align="center">{row.os}</TableCell>
        <TableCell align="center">
          {row.applyOk === 0 ? (
            <span style={{ color: "crimson" }}>미승인</span>
          ) : (
            <span style={{ color: "green" }}>승인</span>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                상세 내역
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">날짜</TableCell>
                    <TableCell align="center">이슈</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row" align="center">
                        {historyRow.date}
                      </TableCell>
                      <TableCell align="center">{historyRow.issue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData(
    new moment().format("YYYY-MM-DD"),
    new moment().format("YYYY-MM-DD"),
    new moment().format("YYYY-MM-DD"),
    "Ubuntu 18.04",
    1,
    [
      {
        date: new moment().format("YYYY-MM-DD"),
        issue: "예약 신청",
      },
      {
        date: new moment().format("YYYY-MM-DD"),
        issue: "승인",
      },
    ]
  ),
  createData(
    new moment().format("YYYY-MM-DD"),
    new moment().format("YYYY-MM-DD"),
    new moment().format("YYYY-MM-DD"),
    "CentOS 7",
    0,
    [
      {
        date: new moment().format("YYYY-MM-DD"),
        issue: "예약 신청",
      },
    ]
  ),
];

export default function ConfirmReservation() {
  const classes = useRowStyles();
  return (
    <TableContainer component={Paper} className={classes.tableWrapper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell align="center">상세내역</TableCell>
            <TableCell align="center">예약 신청일</TableCell>
            <TableCell align="center">시작일</TableCell>
            <TableCell align="center">반납일</TableCell>
            <TableCell align="center">OS</TableCell>
            <TableCell align="center">승인여부</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
