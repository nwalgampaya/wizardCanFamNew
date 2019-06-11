import React from "react";
import Wizard from "../../Wizard";
import FormikApp from "../CancerFamilyReg";
import PreviewInfo from "./PreviewInfo";
// import ChoosePath from "./steps/ChoosePath";
import Family from "./Family";
// import React, { Component } from 'react';
import CancerInfo from "./CancerInfo";
import { properties } from "../../properties.js";

export default class Individual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choosePathFamily: "",
      patientId: "",
      selectedPersonData: [],
      apierror: { debugMessage: "", status: "", timestamp: "", message: "" },
      error: false,
      errorMsg: ""
    };
  }

  setPatientId(e) {
    this.setState({
      patientId: e.target.value
    });
    (this.state.patientId = e.target.value),
      console.log("setPatientId patientId " + e.target.value);
    //this.getPatientDetails();
  }

  setErrorFalse() {
    this.setState({ error: false });
  }
  setErrortrue() {
    this.setState({ error: true });
  }

  checkParent() {
    console.log("parent calling");
  }
  getPatientDetails = () => {
    console.log("patientId getPatientDetails");

    if (this.state.patientId != "") {
      let status;
      const urlpatients =
        properties.baseUrl + "patients/" + this.state.patientId;
      fetch(urlpatients)
        .then(response => {
          status = response.status;
          return response.json();
        })
        .then(data => {
          if (status == 200) {
            console.log(data);
            this.setErrorFalse();
            this.setState({
              selectedPersonData: data
            });
            this.props.onInsertPatientId(this.state.selectedPersonData);
          } else if (status == 404) {
            console.log(data);
            this.state.errorMsg = "Please enter a valid PERSON_CID";
            // "data.apierror.message";
            this.setErrortrue();
            //   this.setState({
            //     errorMsg: data.api(error.message
            //   });
          }

          console.log("pdata" + this.state.selectedPersonData.personCID);

          // this.assignDbDataToFields()
          // this.state.profession.push(data);
        })
        .catch(error => {
          document.write("Error : " + error);
        });
    } else {
      this.state.errorMsg = "Please enter a valid Individual ID";
      this.setErrortrue();
    }
  };

  render() {
    var errorDiv = {
      display: this.state.error ? "block" : "none",
      // marginLeft: "40px",
      textAlign: "center",
      marginBottom: "5px",
      width: "100%",
      marginLeft: "-50px"
    };
    var paraStyle = {
      fontSize: "16px",
      color: "black"
    };
    return (
      <div>
        <p style={paraStyle}>
          Please enter the PERSON_CID to make follow-up updates
        </p>
        <div className="form-holder-search">
          <input
            className="form-control-Search"
            type="search"
            placeholder="PERSON_CID"
            value={this.state.patientId}
            onChange={this.setPatientId.bind(this)}
            name="patientSearch"
          />
          {/* <p>{this.state.patientId}</p> */}
          {/* <h2>In Individual Screen</h2> */}
        </div>
        <div className="inline-error" style={errorDiv}>
          <ul>
            <li className="validationMsg">{this.state.errorMsg}</li>
          </ul>
        </div>
      </div>
    );
  }
}
