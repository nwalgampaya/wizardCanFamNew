import React from "react";
// import React, { Component } from 'react';
import { properties } from "../../properties.js";

import Store from "./FamilyStore";
export default class FamilySaveInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PatientLKDDTO: {
        patientIDs: [],
        lkdDate: "",
        lkdSource: {
          code: ""
        }
      }
    };
  }

  convertDateFormat(date) {
    var formatDatestr = date;
    // console.log( "year: "+ str.slice(0,4) )
    // console.log( "mon: "+ str.slice(4,6) )
    // console.log( "date: "+ str.slice(6,8) )

    // formatDatestr = formatDatestr!=null ? formatDatestr : 0;
    if (formatDatestr != null)
      formatDatestr =
        formatDatestr.slice(4, 6) +
        "/" +
        formatDatestr.slice(6, 8) +
        "/" +
        formatDatestr.slice(0, 4);
    else formatDatestr = "N/A";

    return formatDatestr;
  }

  onSaveCancerFamilyID(e) {
    console.log("onSaveCancerFamilyID");
    // this.props.chkBoxId.map(
    //   (value, i) => (
    //     console.log(" patient id map " + value.patientIDs),
    //     (this.state.PatientLKDDTO.patientIDs[i] = value.patientIDs)
    //   )
    // );
    this.state.PatientLKDDTO.patientIDs = this.props.chkBoxId;
    (this.state.PatientLKDDTO.lkdDate = this.props.currentLKD),
      (this.state.PatientLKDDTO.lkdSource.code = this.props.selectedSrlCode);

    this.state.PatientLKDDTO.userName = global.userName;

    const urlSavefamilyId = properties.baseUrl + "patients/lkd";

    var request = new Request(urlSavefamilyId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.state.PatientLKDDTO),
      mode: "cors",
      credentials: "same-origin",
      crossDomain: true
    });

    fetch(request)
      .then(response => {
        console.log("response" + response.json);
        return response.json();
      })
      //   .then((jsonObject) => {
      //     console.log("UPDATED ID :" + jsonObject.sessionid);
      //     this.state.jsonId = jsonObject.sessionid;
      //     // document.write(`ID ${jsonObject.id} was created!`);
      //   })
      //   .then(() => {
      //     // if (this.state.jsonId.length !== 0) {
      //     // //   this.fetchPractitionerId(this.state.jsonId)
      //     // console.log("has length")
      //     // }
      //   })
      .catch(error => {
        document.write(error);
      });
  }
  createUI() {
    var style = {
      fontSize: "16px",
      textAlign: "center",
      marginTop: "15px"
    };
    return (
      <div>
        {/* // this.props.changedParameters.map((values, i) => */}
        <h3> Review Updates</h3>
        <p style={style}>
          Please ensure the below updates are correct before clicking "Save To
          Database"
        </p>
        <table className="TFtable">
          <tbody>
            <tr>
              <th>Individual ID</th>
              <th>LIVEDATE Old</th>
              <th>LIVEDATE New</th>
            </tr>
            {this.props.chkBoxId.map((value, i) => (
              <tr key={i}>
                {console.log("value saveFam: " + value)}
                <td>{value.patientIDs}</td>
                <td>{this.convertDateFormat(value.lkdDate)}</td>
                <td>{this.convertDateFormat(this.props.currentLKD)}</td>
                {/* {console.log("value : " + value[i].lkdDate)} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      //     <div key={i}>
      //        <input type="text" value={el||''} onChange={this.handleChange.bind(this, i)} />
      //        <input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/>
      //     </div>
    );
  }

  render() {
    return (
      <div>
        {this.createUI()}

        {
          // this.props.changedParameters.map((values, i) => {
          //     // {console.log("ddddddd " + i + " : " + this.props.changedParameters[i].age)}
          //     // {console.log("ddddddd " + i + " : " + this.props.changedParameters[i].id)}
          //     { this.props.changedParameters[i].age }
          // })
        }
      </div>
    );
  }
}
