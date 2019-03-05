import React from "react";
// import React, { Component } from 'react';
import { properties } from "../properties.js";
import Routes from "./Routes";
import { Redirect } from "react-router-dom";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      apierror: { debugMessage: "", status: "", timestamp: "", message: "" },
      error: false,
      errorMsg: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleSubmit = event => {
    var payload = {
      username: this.state.username,
      password: this.state.password
    };
    this.login(payload, event);

    if (this.state.error) {
      event.preventDefault();
    }
    event.preventDefault();
    console.log("test rere");
  };

  handleChangeUserName = event => {
    this.setState({
      username: event.target.value
    });
  };

  handleChangePassword = event => {
    this.setState({
      password: event.target.value
    });
  };

  setErrorFalse() {
    this.setState({ error: false });
  }
  setErrortrue() {
    this.setState({ error: true });
  }
  login(user, e) {
    console.log("patientId getPatientDetails");

    const urlLogin = properties.baseUrl + "login/";

    var request = new Request(urlLogin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      mode: "cors",
      credentials: "same-origin",
      crossDomain: true
    });

    fetch(request)
      //.then((response) => {
      //     console.log("response" + response.json)
      //     return response.json();
      // })
      .then(response => response.text())
      .then(responseText => {
        console.log(JSON.parse(responseText));

        if (responseText === "true") {
          console.log("got api call " + responseText);
          this.setErrortrue();
          this.props.history.push("/uscportal");
        } else {
          var error = JSON.parse(responseText);
          this.state.errorMsg = "Incorrect username and/or password";
          console.log("got api call " + error.apierror.message);
          this.setErrortrue();
          this.state.error = true;
          // e.preventDefault();
        }
      })

      .catch(error => {
        document.write(error);
      });
  }

  render() {
    const userDiv = {
      marginTop: "10px",
      marginBottom: "10px",
      textAlign: "right",
      width: "100%",
      display: "flex"
    };

    const passDiv = {
      marginTop: "10px",
      textAlign: "right",
      width: "100%",
      display: "flex"
    };
    const loginDiv = {
      marginLeft: "25px",
      marginBottom: "20px",
      textAlign: "left"
    };

    const alignStyle = {
      width: "300px"
    };

    const alignHeight = {
      height: "300px"
    };
    const passWordStyle = {
      marginBottom: "5px"
    };

    var errorDiv = {
      display: this.state.error ? "block" : "none",
      marginLeft: "40px",
      textAlign: "center",
      marginBottom: "5px",
      width: "100%"
    };
    var flex = {};

    return (
      <div className="container">
        <div className="content_body centered" style={alignHeight}>
          <div className="welcome-para">
            <p>WELCOME TO THE USC CCFR INFORMATICS DATA PORTAL</p>
          </div>

          <form onSubmit={this.handleSubmit}>
            <div className="form-group" style={userDiv}>
              <div className="col-sm-5 control-margin">Username:</div>
              <div className="col-sm-4  control-margin">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.username}
                  name="demo1"
                  onChange={this.handleChangeUserName}
                  style={alignStyle}
                />
              </div>
            </div>

            <div className="form-group" style={passDiv}>
              <div className="col-sm-5 control-margin">Password:</div>
              <div className="col-sm-4  control-margin " style={passWordStyle}>
                <input
                  type="password"
                  className="form-control"
                  value={this.state.password}
                  name="demo1"
                  onChange={this.handleChangePassword}
                  style={alignStyle}
                />
              </div>
            </div>

            <div className="inline-error" style={errorDiv}>
              <ul>
                <li className="validationMsg">{this.state.errorMsg}</li>
              </ul>
            </div>

            <div className="form-group" style={userDiv}>
              <div className="col-sm-5 control-margin" />
              <div className="col-sm-4  control-margin" style={loginDiv}>
                <input
                  className="btn btn-primary"
                  type="submit"
                  disabled={!this.validateForm()}
                  value="Login"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
