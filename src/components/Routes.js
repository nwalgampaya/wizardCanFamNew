import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Login from './Login';
import FormikApp from "./CancerFamilyReg"
const Routes = () => (
    <Router basename="/usc_test">
        {/* <Router > */}
        <div>
            <Route exact path="/" component={Login} />
            <Route path="/uscportal" component={FormikApp} />
        </div>
    </Router>
);

export default Routes;
