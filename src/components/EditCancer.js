import React from "react";
import {
  Button,
  DropdownButton,
  MenuItem,
  Modal,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { withFormik, Form, Field } from "formik";
import { properties } from "../properties.js";
import FormValidator from "./validator/FormValidator";
import DateSelect from "./util/DateSelect";

// import React, { Component } from 'react';

export default class EditCancer extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new FormValidator([
      {
        field: "site",
        method: "isEmpty",
        validWhen: false,
        message: "Site is required."
      },
      {
        field: "lateral",
        method: "isEmpty",
        validWhen: false,
        message: "lateral is required"
      },
      {
        field: "histo",
        method: "isEmpty",
        validWhen: false,
        message: "Histology is required"
      },
      {
        field: "behaviour",
        method: "isEmpty",
        validWhen: false,
        message: "behaviour is required"
      },
      {
        field: "tissue",
        method: "isEmpty",
        validWhen: false,
        message: "tissue is required"
      },
      {
        field: "diagSource",
        method: "isEmpty",
        validWhen: false,
        message: "diagSource is required"
      },
      {
        field: "dateOfDiagnosis",
        method: "isEmpty",
        validWhen: false,
        message: "dateOfDiagnosis is required"
      },

      {
        field: "dateOfDiagnosis",
        method: this.validateBirthDate,
        validWhen: true,
        message: "Dx Date should be greater than DOB and less than Death Date"
      },

      {
        field: "ageDiagnosis",
        method: "isEmpty",
        validWhen: false,
        message: "ageDiagnosis is required"
      }
    ]);

    this.state = {
      siteData: [],
      familyData: [],
      latralcodeData: [],
      histocodesData: [],
      behaviourcodesData: [],
      diagSourceData: [],
      tissueData: [],
      site: this.props.cancer.site,
      lateral: this.props.cancer.lateral,
      histo: this.props.cancer.histology,
      behaviour: this.props.cancer.behaviour,
      ageDiagnosis: this.props.cancer.ageDiagnosis,
      tissue: this.props.cancer.tissue,
      diagSource: this.props.cancer.diagSource,
      isAgeCalculated: false,

      existingDeathDate: null,
      isExistingDeathDate: false,

      existingBirthDate: null,
      isExistingBirthDate: false,

      selectedYear: "",
      selectedMonth: "",
      selectedDay: "",
      dateOfDiagnosis: "",
      showEditCancerDialog: this.props.showEditCancerDialog,
      cancer: this.props.cancer,
      enableSaveButton: false,
      validation: this.validator.valid()
    };
    //this.setLateral = this.setLateral.bind(this);
    //this.state.latralcodeData.map = this.state.latralcodeData.map.bind(this);

    this.submitted = false;
    this.state.dateOfDiagnosis = this.props.cancer.dateOfDiagnosis;
    this.patientData = this.props.patientData;
    this.cancer = this.props.cancer;

    if (
      this.patientData.dateOfDeath != null &&
      this.patientData.dateOfDeath.length == 8
    ) {
      var dt1 = parseInt(this.patientData.dateOfDeath.substring(6));
      var mon1 = parseInt(this.patientData.dateOfDeath.substring(4, 6));
      var yr1 = parseInt(this.patientData.dateOfDeath.substring(0, 4));
      var date1 = new Date(yr1, mon1 - 1, dt1);
      this.state.existingDeathDate = date1;
      this.state.isExistingDeathDate = true;
    }

    if (
      this.patientData.dateOfBirth != null &&
      this.patientData.dateOfBirth.length == 8
    ) {
      var dt1 = parseInt(this.patientData.dateOfBirth.substring(6));
      var mon1 = parseInt(this.patientData.dateOfBirth.substring(4, 6));
      var yr1 = parseInt(this.patientData.dateOfBirth.substring(0, 4));
      var date1 = new Date(yr1, mon1 - 1, dt1);
      this.state.existingBirthDate = date1;
      this.state.isExistingBirthDate = true;
    }
  }

  handleMonthPickedDiag = selectedMonth => {
    console.log("Month Picked : " + selectedMonth);
    this.setState(
      {
        selectedMonth: selectedMonth != "Month" ? selectedMonth : ""
      },
      () => {
        this.calculateAgeOfDiag();
      }
    );
  };
  handleYearPickedDiag = (selectedYear, e) => {
    console.log("handleYearPicked : " + selectedYear);
    this.setState(
      {
        selectedYear: selectedYear != "Year" ? selectedYear : ""
      },
      () => {
        this.calculateAgeOfDiag();
      }
    );
  };

  calculateAgeOfDiag() {
    let cancerLocal = Object.assign({}, this.state.cancer);
    if (
      this.state.selectedDay != "" &&
      this.state.selectedMonth != "" &&
      this.state.selectedYear != "" &&
      this.state.selectedYear != "9999"
    ) {
      var dateOfDiagn =
        this.state.selectedDay +
        this.state.selectedMonth +
        this.state.selectedYear;
      this.setState({ dateOfDiagnosis: dateOfDiagn });

      cancerLocal.dateOfDiagnosis = dateOfDiagn;

      if (this.state.isExistingBirthDate) {
        var diagDate = this.getDate(
          this.state.selectedDay,
          this.state.selectedMonth,
          this.state.selectedYear
        );
        var age = this.getAge(diagDate, this.state.existingBirthDate);
        this.isAgeCalculated = true;
        this.state.ageDiagnosis = age;
        this.setState({ ageDiagnosis: age, isAgeCalculated: true });
        cancerLocal.ageDiagnosis = age;

        console.log("AGE IS " + age);
      } else {
        this.setState({ ageDiagnosis: "", isAgeCalculated: false });
        cancerLocal.ageDiagnosis = "";
      }
    } else {
      this.setState({
        dateOfDiagnosis: "",
        ageDiagnosis: "",
        isAgeCalculated: false
      });
      cancerLocal.ageDiagnosis = "";
      cancerLocal.dateOfDiagnosis = "";
    }
    this.state.cancer = cancerLocal;
  }
  handleDatePickedDiag = selectedDay => {
    console.log("Date    Picked : " + selectedDay);
    this.setState(
      {
        selectedDay: selectedDay != "Day" ? selectedDay : ""
      },
      () => {
        this.calculateAgeOfDiag();
      }
    );

    // this.calculateAgeOfDiag();
  };
  handleCloseAddCancer() {
    this.setState({ showEditCancerDialog: false });
    this.props.onCloseCancer();
  }

  getTumorNos(data) {
    return data.map(d => d.tumorNo);
  }

  setTumorNo() {
    this.state.cancer.tumorNo = Math.max(
      ...this.getTumorNos(this.patientData.cancerList)
    );
    this.state.cancer.tumorNo = this.state.cancer.tumorNo + 1;
  }
  handleSaveAddCancer(event) {
    console.log(" Adding a cancer");
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      this.setState({ showEditCancerDialog: false });
      this.setState({ validation });
      this.props.onSaveCancer(this.cancer);
      this.props.onCloseCancer();

      // handle actual form submission here
    }

    // this.createNewCancerArray();
    // this.sendNewCancerToPreview();
    // this.setState({ showAddCancer: false });
    // // alert("Saving" + this.state.cancerInfo[this.state.selectedId].age)
    // this.setState({ showAddCancer: false });
  }
  setTissue(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.tissueData.find(
      tissue => tissue.code == e.target.value
    );
    cancerLocal.tissue = selectedObj;
    let target = Object.assign(this.state.cancer, cancerLocal);

    this.setState({
      cancer: target,
      tissue: selectedObj
    });
    if (e.target.value != "") {
      this.state.enableSaveButton = true;
    }
  }

  setSite(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.siteData.find(
      site => site.code == e.target.value
    );
    cancerLocal.site = selectedObj;
    let target = Object.assign(this.state.cancer, cancerLocal);

    this.setState({
      cancer: target,
      site: selectedObj
    });
    if (e.target.value != "") {
      this.state.enableSaveButton = true;
    }
  }

  setDiagSource(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.diagSourceData.find(
      diagSource => diagSource.id == e.target.value
    );
    cancerLocal.diagSource = selectedObj;
    let target = Object.assign(this.state.cancer, cancerLocal);
    this.setState({
      cancer: target,
      diagSource: selectedObj
    });
    if (e.target.value != "") {
      this.state.enableSaveButton = true;
    }
  }
  setBehaviour(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.behaviourcodesData.find(
      behaviour => behaviour.code == e.target.value
    );
    cancerLocal.behaviour = selectedObj;
    let target = Object.assign(this.state.cancer, cancerLocal);
    this.setState({
      cancer: target,
      behaviour: selectedObj
    });
    if (e.target.value != "") {
      this.state.enableSaveButton = true;
    }
  }

  // setLateral = e => {
  //   let cancerLocal = Object.assign({}, this.state.cancer);

  //   // this.state.latralcodeData.map.bind(this);
  //   this.state.latralcodeData.map(lateralParam => {
  //     if (e.target.value == lateralParam.code) {
  //       cancerLocal.lateral = lateralParam;
  //       //this.state.lateral = lateralParam;

  //       () =>
  //         this.setState({
  //           cancer: cancerLocal,
  //           lateral: cancerLocal.lateralParam
  //         });
  //     }
  //   });
  // };
  setLateral = e => {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.latralcodeData.find(
      lateral => lateral.code == e.target.value
    );
    cancerLocal.lateral = selectedObj;

    let target = Object.assign(this.state.cancer, cancerLocal);
    this.setState({
      cancer: target,
      lateral: selectedObj
    });
    if (e.target.value != "") {
      this.state.enableSaveButton = true;
    }
    // this.state.latralcodeData.map.bind(this);
  };
  setHistology = e => {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.histocodesData.find(
      histo => histo.code == e.target.value
    );
    cancerLocal.histology = selectedObj.code;

    this.setState({
      cancer: cancerLocal,
      histo: selectedObj.code
    });
    if (e.target.value != "") {
      this.state.enableSaveButton = true;
    }
  };

  setAge(event) {
    if (event.target.validity.valid) {
      let cancerLocal = Object.assign({}, this.state.cancer);
      cancerLocal.ageDiagnosis = event.target.value;
      this.setState({
        cancer: cancerLocal,
        ageDiagnosis: event.target.value
      });
    }
    if (event.target.value != "") {
      this.state.enableSaveButton = true;
    }
  }

  validateBirthDate = () => {
    if (
      this.state.selectedDay != "" &&
      this.state.selectedMonth != "" &&
      this.state.selectedYear != "" &&
      this.state.selectedYear != "9999"
    ) {
      var diagDate = this.getDate(
        this.state.selectedDay,
        this.state.selectedMonth,
        this.state.selectedYear
      );
      if (this.stateisExistingBirthDate) {
        if (diagDate < this.state.existingBirthDate) {
          return false;
        }
      } else if (this.state.isExistingDeathDate) {
        if (diagDate > this.state.existingDeathDate) {
          return false;
        }
      }
    }
    return true;
  };
  getAge(today, substracted) {
    var curYear = today.getFullYear();
    var dobYear = substracted.getFullYear();
    var age = curYear - dobYear;

    var curMonth = today.getMonth();
    var dobMonth = substracted.getMonth();
    if (dobMonth > curMonth) {
      // this year can't be counted!
      age--;
    } else if (dobMonth == curMonth) {
      // same month? check for day

      var curDay = today.getDate();
      var dobDay = substracted.getDate();
      if (dobDay > curDay) {
        // this year can't be counted!
        age--;
      }
    }

    return age;
  }

  getDate(d, m, y) {
    var currentDate;
    if (d == "99" && m != "99" && y != "9999") {
      currentDate = new Date(15, parseInt(m), parseInt(y));
    } else if (d == "99" && m == "99" && y != "9999") {
      currentDate = new Date(1, 7, parseInt(y));
    } else if (d != "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    }
    return currentDate;
  }
  // setInitialData() {
  //   this.state.siteData.map(site => {});
  // }

  componentDidMount() {
    //setInitialData();

    this.state.showAddCancerDialog = this.props.showAddCancerDialog;
    const urlIcdcodes = properties.baseUrl + "icdcodes";
    fetch(urlIcdcodes)
      .then(response => response.json())
      .then(data => {
        // console.log("siteData : "+ data);
        this.setState({
          siteData: data
        });

        const urlfamilyId = properties.baseUrl + "patients/family/";
        console.log("in compdidmount" + urlfamilyId);

        // this.state.siteData.map((values,i)=>{
        //   // console.log("siteData : "+ values.id);
        //   if(values.id== 2){
        //   console.log("siteData : "+ values.code);

        //   }
        // })
        // this.state.profession.push(data);
      });

    const urlLatralcodes = properties.baseUrl + "latralcodes";
    fetch(urlLatralcodes)
      .then(response => response.json())
      .then(data => {
        // console.log("siteData : "+ data);
        this.setState({
          latralcodeData: data
        });
        // this.state.profession.push(data);
      });

    const urlHistocodes = properties.baseUrl + "histocodes";
    fetch(urlHistocodes)
      .then(response => response.json())
      .then(data => {
        // console.log("histocodes : "+ data);
        this.setState({
          histocodesData: data
        });
        // this.state.profession.push(data);
      });
    const urlBehaviourcode = properties.baseUrl + "behaviourcodes";
    fetch(urlBehaviourcode)
      .then(response => response.json())
      .then(data => {
        // console.log("urlBehaviourcode : "+ data);
        this.setState({
          behaviourcodesData: data
        });
        // this.state.profession.push(data);
      });

    // const urlAgeDiagnosis = properties.baseUrl + "behaviourcodes";
    // fetch(urlAgeDiagnosis)
    //   .then(response => response.json())
    //   .then((data) => {

    //     console.log("ageDiagnosisData : "+ data);
    //     this.setState({
    //       ageDiagnosisData: data,

    //     });
    //     // this.state.profession.push(data);
    //   })

    const urlSource = properties.baseUrl + "dxcodes";
    fetch(urlSource)
      .then(response => response.json())
      .then(data => {
        // console.log("urlBehaviourcode : "+ data);
        this.setState({
          diagSourceData: data
        });
        // this.state.profession.push(data);
      });

    const urltissue = properties.baseUrl + "tissuestatus";
    fetch(urltissue)
      .then(response => response.json())
      .then(data => {
        console.log("urlBehaviourcode : " + data);
        this.setState({
          tissueData: data
        });
        // this.state.profession.push(data);
      });

    // if (this.state.cancer.dateOfDiagnosis != "") {
    //   this.setState({
    //     selectedYear: this.state.cancer.dateOfDiagnosis.substr(0, 4)
    //   });
    //   this.setState({
    //     selectedMonth: this.state.cancer.dateOfDiagnosis.substr(4, 2)
    //   });
    //   this.setState({
    //     selectedDate: this.state.cancer.dateOfDiagnosis.substr(6, 2)
    //   });
    //   console.log("selectedEditDate : " + this.state.selectedEditDate);
    // }
  }

  render() {
    var errorDiv = {
      display: "block",
      textAlign: "center",
      marginBottom: "5px",
      width: "100%"
    };
    var errorDivNone = {
      display: "none"
    };
    let validation = this.submitted // if the form has been submitted at least once
      ? this.validator.validate(this.state) // then check validity every time we render
      : this.state.validation; // otherwise just use what's in state

    return (
      <div>
        <Modal
          backdrop={false}
          show={this.state.showEditCancerDialog}
          onHide={this.handleCloseAddCancer}
          keyboard={false}
          selectedid={this.state.selectedId}
        >
          <Form>
            <Modal.Header closeButton={false}>
              <Modal.Title>
                <div className="modalHeader">Add Cancer</div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* value= {}this.state.data[].name */}
              {/* Condition for the value is needed to render the element at the the initial load */}
              {/* <input type="text" onChange={this.handleTxtChange}  value = {this.state.selectedId=='' ? this.state.cancerInfo[0].age : this.state.cancerInfo[this.state.selectedId].age}/> */}

              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Site:
                </div>
                <div className="col-sm-5 control-margin">
                  {/* <Autocomplete
                    items={this.state.siteData}
                    shouldItemRender={(item, value) =>
                      item.code.toUpperCase().indexOf(value.toUpperCase()) > -1
                    }
                    getItemValue={item => item.code}
                    // shouldItemRender={(item, value) => item.indexOf(value) > -1}
                    // getItemValue={item => item}
                    renderItem={(item, highlighted) => (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: highlighted ? "#eee" : "transparent"
                        }}
                      >
                        {item.code + " || " + item.description}
                      </div>
                    )}
                    value={this.state.newSiteValue}
                    //   onChange={this.setFamilyValue.bind(this)}
                    // onChange={e => this.setState({ value: e.target.value })}
                    onChange={this.setSiteNewOnChange.bind(this)}
                    // onChange={e => this.setState({ siteEditDlg: e.target.value.toUpperCase() })}setSiteOnChange
                    onSelect={this.setSiteNew.bind(this)}
                    //   onSelect={value => this.setState({ value })}
                    //   on
                  /> */}
                  <select
                    /**disabled={this.state.isAlive}**/ className="form-control dorp-box"
                    onChange={this.setSite.bind(this)}
                    name="currentDeathColumn"
                    value={this.state.site.code}
                  >
                    {/* <option>{"Choose One"}</option> */}
                    {this.state.siteData.map((siteGroup, i) => {
                      return (
                        <option key={i} value={siteGroup.code}>
                          {siteGroup.code /*+" | "+siteGroup.description*/}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    className="inline-error-dialog"
                    style={validation.site.isInvalid ? errorDiv : errorDivNone}
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.site.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Lateral:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    required="true"
                    disabled={this.state.isAlive}
                    className="form-control-modal"
                    onChange={this.setLateral.bind(this)}
                    name="newLateralColumn"
                    value={this.state.lateral.code}
                  >
                    {/* <option>{"Choose One"}</option> */}
                    {this.state.latralcodeData.map((lateralList, i) => {
                      return (
                        <option key={i} value={lateralList.code}>
                          {lateralList.description}
                        </option>
                      );
                    })
                    // <option >{"Hospital Rec"}</option>
                    }
                    }
                  </select>
                  <div
                    className="inline-error-dialog"
                    style={
                      validation.lateral.isInvalid ? errorDiv : errorDivNone
                    }
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.lateral.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Histology:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    className="form-control-modal"
                    value={this.state.histo}
                    onChange={this.setHistology.bind(this)}
                    name="newHistoColumn"
                  >
                    {this.state.histocodesData.map((histocodesList, i) => {
                      return (
                        <option key={i} value={histocodesList.code}>
                          {histocodesList.code}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    className="inline-error-dialog"
                    style={validation.histo.isInvalid ? errorDiv : errorDivNone}
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.histo.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Behaviour:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    className="form-control-modal"
                    onChange={this.setBehaviour.bind(this)}
                    name="newBehaviorColumn"
                    value={this.state.behaviour.code}
                  >
                    {/* <option>{"Choose One"}</option> */}
                    {this.state.behaviourcodesData.map(
                      (behaviourcodesList, i) => {
                        return (
                          <option key={i} value={behaviourcodesList.code}>
                            {behaviourcodesList.description}
                          </option>
                        );
                      }
                    )}
                  </select>
                  <div
                    className="inline-error-dialog"
                    style={
                      validation.behaviour.isInvalid ? errorDiv : errorDivNone
                    }
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.behaviour.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required">
                  Date Of Diagnosis:
                </div>
                <div className="col-sm-4 control-margin">
                  <DateSelect
                    isAlive={false}
                    value={this.state.dateOfDiagnosis}
                    dateOfDiagFromDb={this.state.dateOfDiagnosis}
                    name="diagDateNewColumn"
                    onSelectYear={this.handleYearPickedDiag}
                    onSelectMonth={this.handleMonthPickedDiag}
                    onSelectDate={this.handleDatePickedDiag}
                  />

                  <div
                    className="inline-error-dialog"
                    style={
                      validation.dateOfDiagnosis.isInvalid
                        ? errorDiv
                        : errorDivNone
                    }
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.dateOfDiagnosis.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Age Of Diagnosis:</div>
                <div className="col-sm-4 control-margin">
                  <input
                    className="form-control-modal"
                    //disabled={this.state.dateOfDiagFromDb != "" ? false : false}
                    false="text"
                    value={this.state.ageDiagnosis}
                    onChange={this.setAge.bind(this)}
                    name="ageDiagnosisFromDb"
                    pattern="^-?[0-9]\d*\.?\d*$"
                    disabled={this.state.isAgeCalculated}
                  />
                  <div
                    className="inline-error-dialog"
                    style={
                      validation.ageDiagnosis.isInvalid
                        ? errorDiv
                        : errorDivNone
                    }
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.ageDiagnosis.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Source:</div>
                <div className="col-sm-5 control-margin">
                  <select
                    className="form-control-modal"
                    onChange={this.setDiagSource.bind(this)}
                    name="currentDeathColumn"
                    value={this.state.diagSource.id}
                  >
                    {/* <option>{"Choose One"}</option> */}
                    {this.state.diagSourceData.map((diagSourceList, i) => {
                      return (
                        <option key={i} value={diagSourceList.id}>
                          {diagSourceList.description}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    className="inline-error-dialog"
                    style={
                      validation.diagSource.isInvalid ? errorDiv : errorDivNone
                    }
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.diagSource.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Tissue:</div>
                <div className="col-sm-5 control-margin">
                  <select
                    className="form-control-modal"
                    onChange={this.setTissue.bind(this)}
                    name="currentDeathColumn"
                    value={this.state.tissue.code}
                  >
                    {/* <option>{"Choose One"}</option> */}
                    {this.state.tissueData.map((tissueList, i) => {
                      return (
                        <option key={i} value={tissueList.code}>
                          {tissueList.description}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    className="inline-error-dialog"
                    style={
                      validation.tissue.isInvalid ? errorDiv : errorDivNone
                    }
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.tissue.message}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <hr />
            </Modal.Body>
            <Modal.Footer>
              {/* <button type="submit">submit</button>
                    <button type="submit" onClick={this.handleCloseAddCancer} >Close</button> */}

              <button
                className="btn btn-primary"
                type="button"
                onClick={this.handleCloseAddCancer.bind(this)}
              >
                Close
              </button>
              {/* <Button onClick={this.handleCloseAddCancer} >Close</Button> */}
              {/* <button  disabled={isSubmitting}>Save</button> */}
              {/* <button  type= "submit" disabled={isSubmitting}>Save</button> */}
              {/* <Button disabled= {!this.state.enableSaveButton} onClick={this.handleSave}>Save</Button> */}

              <Button
                className="btn btn-primary"
                onClick={this.handleSaveAddCancer.bind(this)}
                disabled={!this.state.enableSaveButton}
              >
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    );
  }
}
