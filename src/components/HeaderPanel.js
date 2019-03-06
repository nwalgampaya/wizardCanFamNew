import React from "react";
// import React, { Component } from 'react';

export default class HeaderPanel extends React.Component {
  render() {
    return (
      // <div>
      <div className="box headerPanel1">
        <div className="headerPanel1Div">
          <span className="headerPanel1Span">
            Individual ID :{this.props.patientDetials.personCID}
          </span>
        </div>

        <div className="headerPanel2">
          <span className="headerPanel2Span">
            <b>Person ID </b> : {this.props.patientDetials.personID}&nbsp;
            <b>Family ID </b> {this.props.patientDetials.familyID}&nbsp;
            <b>MotherID </b> : {this.props.patientDetials.motherID} &nbsp;
            <b>FatherID </b> :{this.props.patientDetials.fatherID}&nbsp;
            <b>TwinID </b> : {this.props.patientDetials.twinID}
          </span>
        </div>
        <div className="headerPanel3">
          <span className="headerPanel3Span">
            <b>EPI_Q_COLON</b> :
            {this.props.patientDetials.ePIQColon.description}
            &nbsp;&nbsp; <b>BLOOD</b> :
            {this.props.patientDetials.blood.description}
          </span>
        </div>
        <div className="headerPanel3">
          <span className="headerPanel3Span">
            <b>BUCCAL_SALIVA </b>
            {this.props.patientDetials.buccalSalvia.description}
          </span>
        </div>
      </div>
      // </div>
    );
  }
}
