import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import "./index.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import App from "./App";
import SignUp from "./user/SignUp";
import MainPage from "./MainPage";
import ServerStatus from "./client/ServerStatus";
import ApplyReservation from "./client/ApplyReservation";
import ConfirmReservation from "./client/ConfirmReservation";

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Noto Sans KR', 'Roboto', sans-serif",
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#F12777",
    },
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Router history={browserHistory}>
      <Route path="/" component={MainPage} />
      <Route path="/signup" component={SignUp} />
      <Route path="/client" component={App}>
        <IndexRoute component={ServerStatus} />
        <Route path="apply_reservation" component={ApplyReservation} />
        <Route path="confirm_reservation" component={ConfirmReservation} />
      </Route>
    </Router>
  </MuiThemeProvider>,
  document.getElementById("root")
);
