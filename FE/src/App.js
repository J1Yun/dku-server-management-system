import React from "react";
import Header from "./Header";
import { Container } from "@material-ui/core";
import Copyright from "./Copyright";

export default function App({ ...props }) {
  return (
    <>
      <Header />
      <Container style={{ padding: 10, paddingTop: 20 }}>
        {props.children}
      </Container>
      <Copyright />
    </>
  );
}
