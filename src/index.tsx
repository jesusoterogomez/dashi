import React from 'react';
import {render} from 'react-dom';
import {init} from 'firebase-utils/init';
import firebase from 'firebase';
import { Router, RouteComponentProps, Redirect } from "@reach/router";
import * as serviceWorker from './serviceWorker';
import Menu from 'components/Menu';
import './index.scss';

// Pages
import Home from 'views/Home';
import Dash from 'views/Dash';
import Profile from 'views/Profile';
import Login from 'views/Login';

import {useAuthState} from 'react-firebase-hooks/auth';
import OAuth from 'views/OAuth';

const target = document.getElementById('root');

const PrivateRoutes = (props: any) => {
    const [user, isLoading] = useAuthState(firebase.auth());

    if (isLoading) {
        return <p>wait</p>;
    }

    if (user) {
        return (
            <div>
                <Menu />
                {props.children}
            </div>
        );
    }

    return <Redirect from="" to="login" noThrow />;
};


const HomeRoute = (_: RouteComponentProps) => <Home/>;
const DashRoute = (_: RouteComponentProps) => <Dash/>;
const LoginRoute = (_: RouteComponentProps) => <Login />

// Initialize firebase client
init();

const routes = (
    <Router>
        <PrivateRoutes path="/">
            <HomeRoute path="/"/>
            <Profile path="/profile"/>
            <OAuth path="/oauth/callback"/>
        </PrivateRoutes>

        <DashRoute path="/dash/:id"/>

        {/* Public routes */}
        <LoginRoute path="login"/>

        {/* Dash
                Join
                Leave
                Settings */}
        {/* Account
                Services
                Settings
                Sign up
                Login */}
    </Router>
);


render(routes, target);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
