import React from "react";
import SnackbarContent from "@material-ui/core/SnackbarContent";

export default function SnackMessage({ message }) {
  return (
    <SnackbarContent
      message={message}
      style={{ backgroundColor: "#555", fontSize: 16 }}
    />
  );
}
