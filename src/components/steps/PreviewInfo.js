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
        textAlign: "left",
        marginLeft: "30px",
        fontSize: "15px"
      };
      var styleSubHeader = {
        marginBottom: "10px",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "16px"
      };

      var tabWidthStyle = {
        tableLayout: "fixed",
        width: "150px"
      };
      var prevWidthStyle = {
        tableLayout: "fixed",
        width: "550px"
      };
      return (
        <div>
          <p style={styleSubHeader}>Individual Details Updated</p>
          <table className="PRtable">
            <tbody>
              <tr>
                <th style={tabWidthStyle}>Column Name</th>
                <th style={prevWidthStyle}>Previous Value</th>
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
  convertGenderAndVitalStatus(values) {
    if (values.column == "Gender") {
      console.log("newValue*********************************:" + values.newVal);
      if (values.newVal == 1) {
        values.newVal = "Male";
      } else if (values.newVal == 2) {
        values.newVal = "Female";
      } else if (values.newVal == 9) {
        values.newVal = "Unknown";
      }
    }
    if (values.column == "Vital Status") {
      if (values.newVal == 1) {
        values.newVal = "Alive";
      } else if (values.newVal == 2) {
        values.newVal = "Dead";
      } else if (values.newVal == 9) {
        values.newVal = "Unknown";
      }
    }
  }

  loopPersonDetails() {
    const tableRowStyle = {
      // fontFamily: "Muli-SemiBold",
      fontWeight: "normal",
      color: "rgb(23, 54, 93)"
      // marginLeft: "-10px"
    };
    return this.props.arrayOfChangedFields.map((values, i) => (
      // <div>

      <tr>
        {this.convertGenderAndVitalStatus(values)}

        <td>{values.column}</td>
        <td style={tableRowStyle}>
          {values.previousVal}
          {/* {this.props.arrayEditedData[i].age} */}
        </td>
        <td style={tableRowStyle}>
          {values.newVal}

          {/* {this.props.changedParameters[i].age} */}
          {/* {values.id} */}
        </td>
      </tr>
      // </div>
    ));
  }

  createNewCancerUI() {
    var style = {
      marginBottom: "10px",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: "16px"
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

  createCancerFields() {
    console.log("In new Cancer Preview");
    const tableRowStyle = {
      fontWeight: "normal",
      color: "rgb(23, 54, 93)"
    };
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
            <td style={tableRowStyle}>{values.site.code}</td>
          </tr>
          <tr>
            <td>Lateral</td>
            <td style={tableRowStyle}>{values.lateral.description}</td>
          </tr>
          <tr>
            <td>Histology</td>
            <td style={tableRowStyle}>{values.histology}</td>
          </tr>
          <tr>
            <td>Behavior</td>
            <td style={tableRowStyle}>{values.behaviour.description}</td>
          </tr>
          <tr>
            <td>Date Of Diagnosis</td>
            <td style={tableRowStyle}>
              {this.convertDateFormat(values.dateOfDiagnosis)} }
            </td>
          </tr>
          <tr>
            <td>Age Of Diagnosis</td>
            <td style={tableRowStyle}>
              {values.ageDiagnosis /* {values.lateral.code} */}
            </td>
          </tr>
          <tr>
            <td>Source</td>
            <td style={tableRowStyle}>{values.diagSource.description}</td>
          </tr>
          <tr>
            <td>Tissue</td>
            <td style={tableRowStyle}>{values.tissue.description}</td>
          </tr>
        </tbody>
      </table>
    ));
  }

  createEditedCancerUI() {
    var style = {
      marginBottom: "10px",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: "16px"
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

  setDataType() {}
  // convertToGetDate(date) {
  //   var formatDatestr = date;

  //   if (formatDatestr != null) {
  //     var year = formatDatestr.slice(0, 4);
  //     var month = formatDatestr.slice(4, 6);
  //     var date = formatDatestr.slice(6, 8);

  //     formatDatestr = month + "/" + date + "/" + year;
  //   } else formatDatestr = "N/A";
  //   console.log("formatDatestr : " + formatDatestr);

  //   return formatDatestr;
  // }

  showCancerEditedFields() {
    this.state.editedRecordCount = this.props.editedRecordCount;
    console.log("&&&&&&&&&&&&&&&&&&&&&&&  :" + this.props.editedRecordCount);
    this.state.arrayOfChangedFields = this.props.arrayOfChangedFields;
    var tabWidthStyle = {
      tableLayout: "fixed",
      width: "150px"
    };
    var prevWidthStyle = {
      tableLayout: "fixed",
      width: "550px"
    };
    const tableRowStyle = {
      fontWeight: "normal",
      color: "rgb(23, 54, 93)"
      // marginLeft: "-10px"
    };
    // this.props.arrayOfChangedFields.map((values,i)=>{
    //     console.log("&&&&&&&&&&&&&&&&&&&&&&&  arrayOfChangedFields:" + values.column)

    // })

    // if(this.props.isCancerEdited){
    return this.props.arrayEditedData.map(
      (values, i) => (
        <table className="PRtable">
          <tbody>
            <tr>
              <th style={tabWidthStyle}>Column Name</th>
              <th style={prevWidthStyle}>Previous Value</th>
              <th>New Value</th>
            </tr>
            {values.map((val, i) => (
              <tr>
                <td>{val.column}</td>
                <td style={tableRowStyle}>
                  {val.column == "Date Of Diagnosis"
                    ? this.convertDateFormat(val.previousVal)
                    : val.previousVal}
                </td>
                <td style={tableRowStyle}>
                  {val.column == "Date Of Diagnosis"
                    ? this.convertDateFormat(val.newVal)
                    : val.newVal}
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
    if (
      this.props.isCanecerAdded ||
      this.props.isCancerEdited ||
      this.props.isCanFamEdited
    ) {
      return (
        <div>
          {this.createTablePersonDetails()}

          {this.createEditedCancerUI()}

          {this.createNewCancerUI()}
        </div>
      );
    } else {
      var fontcolor = {
        fontSize: "16px"
      };
      return (
        <div>
          <h3 className="reviewStyle"> Review Details </h3>
          <div className="boxPreview headerPanelPreview">
            <p style={fontcolor}>
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
      marginBottom: "6px",
      fontWeight: "bold",
      fontSize: "18px",
      marginLeft: "30px",
      marginTop: "15px,"
    };

    var style2 = {
      fontSize: "17px",
      textAlign: "center"
    };
    if (
      this.props.isCanecerAdded ||
      this.props.isCancerEdited ||
      this.props.isCanFamEdited
    ) {
      return <p style={style}> Review Updates </p>;
    }
  }

  revievBeforreSaveEnd() {
    var style = {
      marginBottom: "6px",
      fontWeight: "bold",
      fontSize: "18px",
      textAlign: "left",
      marginLeft: "30px",
      marginTop: "5px,"
    };

    var style2 = {
      fontSize: "16px",
      textAlign: "center"
    };
    if (
      this.props.isCanecerAdded ||
      this.props.isCancerEdited ||
      this.props.isCanFamEdited
    ) {
      return (
        <p style={(style, style2)}>
          Please ensure the below updates are correct before clicking "Save To
          Database"
        </p>
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
    const tableRowStyle = {
      marginBottom: "5px",
      marginLeft: "-10px"
    };
    return (
      <div>
        {this.setHeaderPanel()}
        {this.revievBeforreSave()}
        {/* {this.displayLiveDate()} */}
        {/* {this.createTablePersonDetails()} */}

        {this.createUI()}

        {this.revievBeforreSaveEnd()}
      </div>
    );
  }
}
