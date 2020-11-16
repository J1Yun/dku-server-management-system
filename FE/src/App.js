import React from "react";
import ClientHeader from "./ClientHeader";
import AdminHeader from "./AdminHeader";
import { Container } from "@material-ui/core";
import Copyright from "./Copyright";

export default function App({ ...props }) {
  return (
    <>
      {props.location.pathname.split("/")[1] === "client" ? (
        <ClientHeader />
      ) : (
        <AdminHeader />
      )}
      <Container style={{ padding: 10, paddingTop: 20 }}>
        {props.children}
      </Container>
      <Copyright />
    </>
  );
}
