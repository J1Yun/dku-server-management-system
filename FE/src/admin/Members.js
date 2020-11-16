import React, { useState } from "react";
import { DataGrid } from "@material-ui/data-grid";

const sortModel = [
  {
    field: "name",
    sort: "asc",
  },
];

const columns = [
  { field: "id", hide: true },
  { field: "name", headerName: "성명", width: 160 },
  { field: "department", headerName: "소속", width: 220 },
  {
    field: "userId",
    headerName: "이메일(아이디)",
    disableClickEventBubbling: true,
    width: 230,
  },
  {
    field: "tel",
    headerName: "전화번호",
    disableClickEventBubbling: true,
    width: 170,
  },
  { field: "penalty", headerName: "페널티" },
];

const userSample = [
  {
    id: 1,
    name: "허전진",
    department: "소프트웨어학과",
    userId: "zinirun@github.com",
    tel: "010-1234-1234",
    penalty: 0,
  },
  {
    id: 2,
    name: "허전진",
    department: "기계공학과",
    userId: "zinirun@github.com",
    tel: "010-1234-1234",
    penalty: 2,
  },
  {
    id: 3,
    name: "조정민",
    department: "응용통계학과",
    userId: "hello@github.com",
    tel: "010-1234-1234",
    penalty: 1,
  },
];

export default function Members() {
  const [data, setData] = useState(userSample);

  return (
    <div style={{ height: 600, width: "100%", marginTop: 40 }}>
      <DataGrid sortModel={sortModel} columns={columns} rows={data} />
    </div>
  );
}
