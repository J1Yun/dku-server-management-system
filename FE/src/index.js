import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { ApolloProvider } from 'react-apollo';
import { AplClient as client } from './conf';

import App from './App';
import MainPage from './MainPage';
import SignUp from './user/SignUp';

import AdminDashboard from './admin/Dashboard';
import Console from './admin/Console';
import AdminCalendar from './admin/Calendar';
import Confirm from './admin/Confirm';
import Members from './admin/Members';
import Reservations from './admin/Reservations';

import ClientDashboard from './client/Dashboard';
import ClientCalendar from './client/Calendar';
import ApplyReservation from './client/ApplyReservation';
import ApplyReturn from './client/ApplyReturn';
import ConfirmReservation from './client/ConfirmReservation';
import Ask from './client/Ask';

import ResDoc from './document/ResDoc';
import RetDoc from './document/RetDoc';

import NotFound from './NotFound';

const theme = createMuiTheme({
    typography: {
        fontFamily: "'Noto Sans KR', 'Roboto', sans-serif",
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#F12777',
        },
    },
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <ApolloProvider client={client}>
            <Router history={browserHistory}>
                <Route path="/" component={MainPage} />
                <Route path="/signup" component={SignUp} />
                <Route path="/admin" component={App}>
                    <IndexRoute component={AdminDashboard} />
                    <Route path="dashboard" component={AdminDashboard} />
                    <Route path="console" component={Console} />
                    <Route path="calendar" component={AdminCalendar} />
                    <Route path="confirm" component={Confirm} />
                    <Route path="members" component={Members} />
                    <Route path="reservations" components={Reservations} />
                </Route>
                <Route path="/client" component={App}>
                    <IndexRoute component={ClientDashboard} />
                    <Route path="dashboard" component={ClientDashboard} />
                    <Route path="calendar" component={ClientCalendar} />
                    <Route path="apply_reservation" component={ApplyReservation} />
                    <Route path="apply_return" component={ApplyReturn} />
                    <Route path="confirm_reservation" component={ConfirmReservation} />
                    <Route path="ask" component={Ask} />
                </Route>
                <Route path="/doc/res" component={ResDoc} />
                <Route path="/doc/ret" component={RetDoc} />
                <Route path="*" component={NotFound} />
            </Router>
        </ApolloProvider>
    </MuiThemeProvider>,
    document.getElementById('root'),
);
