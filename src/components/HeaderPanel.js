import React from "react";
// import React, { Component } from 'react';

export default class HeaderPanel extends React.Component {
  render() {
    return (
      // <div>
      <div className="box headerPanel1">
        <div className="headerPanel1Div">
          <span className="headerPanel1Span">
            <b>PERSON_CID:</b> {this.props.patientDetials.personCID}
          </span>
        </div>
        <div className="headerGroup">
          <div className="headerPanel2">
            <span className="headerPanel2Span">
              <b>Person ID:</b> {this.props.patientDetials.personID}
              <br />
              <b>Family ID:</b> {this.props.patientDetials.familyID}
              <br />
              <b>MotherID:</b> {this.props.patientDetials.motherID} <br />
              <b>FatherID:</b> {this.props.patientDetials.fatherID}
              <br />
            </span>
          </div>
          <div className="headerPanel3">
            <span className="headerPanel3Span">
              <b>TwinID:</b> {this.props.patientDetials.twinID} <br />
              <b>EPI_Q_COLON:</b>{" "}
              {this.props.patientDetials.ePIQColon.description}
              <br />
              <b>BLOOD:</b> {this.props.patientDetials.blood.description}
              <br />
              <b>BUCCAL_SALIVA:</b>{" "}
              {this.props.patientDetials.buccalSalvia.description}
            </span>
          </div>
        </div>
        <div className="headerPanel3" />
      </div>
      // </div>
    );
  }
}
