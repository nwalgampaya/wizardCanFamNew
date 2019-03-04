import React from "react";
import HeaderPanel from "../HeaderPanel";
// import React, { Component } from 'react';

export default class PreviewInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editedRecordCount: 0,
      arrayOfChangedFields: [],
      isInPreviewScreen: false,
      patientData: null
    };
    this.state.patientData = this.props.patientData;
  }

  onCancerInfoPage() {
    this.state.isInPreviewScreen = false;

    console.log(
      " onCancerInfoPage onCancerInfoPage " + this.state.isInPreviewScreen
    );
    // this.props.toMakePerviewFlagFalse(this.state.isInPreviewScreen)
    this.props.onPreviewPage(this.state.isInPreviewScreen);
  }
  componentDidMount() {
    console.log(" Preview componentDidMount " + this.state.isInPreviewScreen);

    // This will make condition true for saving the record in onSubmit() function in CancerFamilyReg.js
    this.state.isInPreviewScreen = true;
    this.props.onPreviewPage(this.state.isInPreviewScreen);
  }
  createTablePersonDetails() {
    if (this.props.isCanFamEdited) {
      var style = {
        marginLeft: "23px",
        fontWeight: "bold",
        textAlign: "left"
      };
      return (
        <div>
          <p style={style}>Individual Details Updated</p>
          <table className="PRtable">
            <tbody>
              <tr>
                <th>Column Name</th>
                <th>Previous Value</th>
                <th>New Value</th>
              </tr>
              {/* {values.map((val,i)=> */}
              {this.loopPersonDetails()}
            </tbody>
          </table>
        </div>
        //     <div key={i}>
        //        <input type="text" value={el||''} onChange={this.handleChange.bind(this, i)} />
        //        <input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/>
        //     </div>
      );
    }
  }
  loopPersonDetails() {
    return this.props.arrayOfChangedFields.map((values, i) => (
      <tr>
        <td>{values.column}</td>
        <td>
          {values.previousVal}
          {/* {this.props.arrayEditedData[i].age} */}
        </td>
        <td>
          {values.newVal}

          {/* {this.props.changedParameters[i].age} */}
          {/* {values.id} */}
        </td>
      </tr>
    ));
  }

  createNewCancerUI() {
    var style = {
      marginLeft: "23px",
      fontWeight: "bold",
      textAlign: "left"
    };
    if (this.props.isCanecerAdded) {
      return (
        <div>
          <p style={style}>Added Cancer Details</p>
          {this.createCancerFields()}
        </div>
      );
    }
  }

  createCancerFields() {
    console.log("In new Cancer Preview");
    // || this.props.isCancerEdited
    // if(this.props.isCanecerAdded ){
    return this.props.newCancerArr.map((values, i) => (
      <table className="PRtable">
        <tbody>
          <tr>
            <th>Column Name</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Site</td>
            <td>{values.site.code}</td>
          </tr>
          <tr>
            <td>Lateral</td>
            <td>{values.lateral.description}</td>
          </tr>
          <tr>
            <td>Histology</td>
            <td>{values.histology}</td>
          </tr>
          <tr>
            <td>Behavior</td>
            <td>{values.behaviour.description}</td>
          </tr>
          <tr>
            <td>Date Of Diagnosis</td>
            <td>{values.dateOfDiagnosis /* {values.site.code} */}</td>
          </tr>
          <tr>
            <td>Age Of Diagnosis</td>
            <td>{values.ageDiagnosis /* {values.lateral.code} */}</td>
          </tr>
          <tr>
            <td>Source</td>
            <td>{values.diagSource.description}</td>
          </tr>
          <tr>
            <td>Tissue</td>
            <td>{values.tissue.description}</td>
          </tr>
        </tbody>
      </table>
    ));
  }

  createEditedCancerUI() {
    var style = {
      marginLeft: "23px",
      fontWeight: "bold",
      textAlign: "left"
    };
    if (this.props.isCancerEdited) {
      return (
        <div>
          <p style={style}>Updated Cancer Details |</p>
          {this.showCancerEditedFields()}
        </div>
      );
    }
  }
  showCancerEditedFields() {
    this.state.editedRecordCount = this.props.editedRecordCount;
    console.log("&&&&&&&&&&&&&&&&&&&&&&&  :" + this.props.editedRecordCount);
    this.state.arrayOfChangedFields = this.props.arrayOfChangedFields;

    // this.props.arrayOfChangedFields.map((values,i)=>{
    //     console.log("&&&&&&&&&&&&&&&&&&&&&&&  arrayOfChangedFields:" + values.column)

    // })

    // if(this.props.isCancerEdited){
    return this.props.arrayEditedData.map(
      (values, i) => (
        <table className="PRtable">
          <tbody>
            <tr>
              <th>Column Name</th>
              <th>Previous Value</th>
              <th>New Value</th>
            </tr>
            {values.map((val, i) => (
              <tr>
                <td>{val.column}</td>
                <td>
                  {val.previousVal}
                  {/* {this.props.arrayEditedData[i].age} */}
                </td>
                <td>
                  {val.newVal}

                  {/* {this.props.changedParameters[i].age} */}
                  {/* {values.id} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
      //     <div key={i}>
      //        <input type="text" value={el||''} onChange={this.handleChange.bind(this, i)} />
      //        <input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/>
      //     </div>
    );
  }

  createUI() {
    if (this.props.isCanecerAdded || this.props.isCancerEdited) {
      return (
        <div>
          {/* {this.createTablePersonDetails()}  */}

          {this.createEditedCancerUI()}

          {this.createNewCancerUI()}
        </div>
      );
    } else {
      return (
        <div>
          <h4 className="reviewStyle"> Review Details </h4>
          <div className="boxPreview headerPanelPreview">
            <p>
              {" "}
              No data changes have been made. Please Exit Record or make changes
              to Save to Database.
            </p>
          </div>
        </div>
      );
    }
  }

  displayLiveDate() {
    if (
      this.props.isCanecerAdded ||
      (this.props.isCancerEdited && !this.props.isCanFamEdited)
    ) {
      return (
        <div>
          <table className="PRtable">
            <tbody>
              <tr>
                <th>Column Name</th>
                <th>Previous Value</th>
                <th>New Value</th>
              </tr>
              <tr>
                <td> Live Date</td>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
  }
  revievBeforreSave() {
    var style = {
      marginBottom: "8px",
      fontWeight: "bold"
    };
    if (this.props.isCanecerAdded || this.props.isCancerEdited) {
      return (
        <div>
          <p style={style}> Review Details </p>
          <div>
            <p>
              {" "}
              Please ensure the below updates are correct before clicking "Save
              to Database" .
            </p>
          </div>
        </div>
      );
    }
  }
  setHeaderPanel() {
    return (
      <div>
        <HeaderPanel patientDetials={this.state.patientData} />
      </div>
    );
  }
  // createUI() {
  //     this.state.isInPreviewScreen = true;
  //     if (this.props.isCanecerAdded || this.props.isCancerEdited) {

  //                 {this.createEditedCancerUI()}

  //                 {this.createNewCancerUI()}

  //     } else {
  //         return (
  //             <div>
  //                 <h3> Review Details </h3>
  //                 <p> No data changes have been made. Please Exit Record or make changes to Save to Database.</p>
  //             </div>)
  //     }
  //     // this.props.onPreviewPage(this.state.isInPreviewScreen)
  // }
  render() {
    return (
      <div>
        {this.setHeaderPanel()}
        {this.revievBeforreSave()}
        {this.displayLiveDate()}
        {this.createTablePersonDetails()}

        {this.createUI()}

        {/* {this.createCancerFields()} */}
      </div>
    );
  }
}
