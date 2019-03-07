import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './Login';
import FormikApp from "./CancerFamilyReg"
const Routes = () => (
    <Router >
        {/* <Router basename="/usc_test"> */}
        <div>
            <Route exact path="/" component={Login} />
            <Route path="/uscportal" component={FormikApp} />
        </div>
    </Router>
);

export default Routes;
