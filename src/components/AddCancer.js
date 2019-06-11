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
import Autocomplete from "react-autocomplete";
// import React, { Component } from 'react';

export default class AddCancer extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new FormValidator([
      {
        field: "site",
        method: "isEmpty",
        validWhen: false,
        message: "Site is a required field"
      },
      {
        field: "site",
        method: this.validSite,
        validWhen: true,
        message: "Invalid Site."
      },
      {
        field: "lateral",
        method: "isEmpty",
        validWhen: false,
        message: "Lateral is a required field"
      },
      {
        field: "histology",
        method: "isEmpty",
        validWhen: false,
        message: "Histology is a required field"
      },
      {
        field: "histology",
        method: this.validHistology,
        validWhen: true,
        message: "Invalid Histology"
      },
      {
        field: "behaviour",
        method: "isEmpty",
        validWhen: false,
        message: "Behaviour is a required field"
      },
      {
        field: "tissue",
        method: "isEmpty",
        validWhen: false,
        message: "Tissue is a required field"
      },
      {
        field: "diagSource",
        method: "isEmpty",
        validWhen: false,
        message: "Source is a required field"
      },
      {
        field: "dateOfDiagnosis",
        method: "isEmpty",
        validWhen: false,
        message: "Date Of Diagnosis cannot be empty"
      },

      {
        field: "ageDiagnosis",
        method: "isEmpty",
        validWhen: false,
        message: "Age Of Diagnosis is a required field"
      },
      {
        field: "dateOfDiagnosis",
        method: this.validateBirthDate,
        validWhen: true,
        message: "Dx Date should be greater than DOB and less than Death Date"
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
      site: "",
      lateral: "",
      histology: "",
      behaviour: "",
      ageDiagnosis: "",
      tissue: "",
      diagSource: "",
      isAgeCalculated: false,

      existingDeathDate: null,
      isExistingDeathDate: false,

      existingBirthDate: null,
      isExistingBirthDate: false,

      selectedYear: "",
      selectedMonth: "",
      selectedDay: "",
      dateOfDiagnosis: "",
      cancer: {
        patientPersonID: "",
        tumorNo: "",
        site: new Object(),
        lateral: new Object(),
        histology: "",
        behaviour: new Object(),
        dateOfDiagnosis: "",
        ageDiagnosis: "",
        tissue: new Object(),
        diagSource: new Object()
      },
      validation: this.validator.valid()
    };
    this.submitted = false;
    this.showAddCancerDialog = this.props.showAddCancerDialog;
    this.patientData = this.props.patientData;

    if (
      this.patientData.dateOfDeath != null &&
      this.patientData.dateOfDeath.length == 8
    ) {
      var dt1 = parseInt(this.patientData.dateOfDeath.substring(6));
      var mon1 = parseInt(this.patientData.dateOfDeath.substring(4, 6));
      var yr1 = parseInt(this.patientData.dateOfDeath.substring(0, 4));

      if (yr1 != "9999") {
        this.state.existingDeathDate = date1;
        this.state.isExistingDeathDate = true;
        var date1 = new Date(yr1, mon1 - 1, dt1);
      } else {
        this.state.isExistingDeathDate = false;
      }
    }

    if (
      this.patientData.dateOfBirth != null &&
      this.patientData.dateOfBirth.length == 8
    ) {
      var dt1 = parseInt(this.patientData.dateOfBirth.substring(6));
      var mon1 = parseInt(this.patientData.dateOfBirth.substring(4, 6));
      var yr1 = parseInt(this.patientData.dateOfBirth.substring(0, 4));
      if (yr1 != "9999") {
        var date1 = new Date(yr1, mon1 - 1, dt1);
        this.state.existingBirthDate = date1;
        this.state.isExistingBirthDate = true;
      } else {
        this.state.isExistingBirthDate = false;
      }
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
    // this.setState(
    //   {
    //     ageDiagnosisFromDb: this.state.ageDiagnosisFromDb
    //   },
    //   () => {
    //     this.calculateAgeOfDiag();
    //   }
    // );
    // this.calculateAgeOfDiag();

    // if(handleYearPickedDiag!=''    handleMonthPickedDiag!=''    handleDatePickedDiag!='')
    // this.state.ageDiagnosisFromDb = 22
  };

  calculateAgeOfDiag() {
    console.log("in age calc start");

    let cancerLocal = Object.assign({}, this.state.cancer);
    if (
      this.state.selectedDay != "" &&
      this.state.selectedMonth != "" &&
      this.state.selectedYear != ""
    ) {
      if (
        this.state.selectedYear != "9999" &&
        this.state.selectedMonth != "99" &&
        this.state.selectedDay != "99"
      ) {
        console.log("in age calc");
        var dateOfDiagn =
          this.state.selectedYear +
          this.state.selectedMonth +
          this.state.selectedDay;
        this.setState({ dateOfDiagnosis: dateOfDiagn });
        console.log("in age calc " + this.state.dateOfDiagnosis);

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
        var dateOfDiagn =
          this.state.selectedYear +
          this.state.selectedMonth +
          this.state.selectedDay;
        this.setState({ dateOfDiagnosis: dateOfDiagn });
        //this.setState({ ageDiagnosis: "", isAgeCalculated: false });
        this.setState({ isAgeCalculated: false });
        //cancerLocal.ageDiagnosis = "";
        console.log("in age calc " + this.state.dateOfDiagnosis);

        cancerLocal.dateOfDiagnosis = dateOfDiagn;
      }
    } else {
      this.setState({
        dateOfDiagnosis: "",
        //ageDiagnosis: "",
        isAgeCalculated: false
      });
      //cancerLocal.ageDiagnosis = "";
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
    this.setState({ showAddCancerDialog: false });
    this.props.oncCloseCancer();
  }

  getTumorNos(data) {
    return data.map(d => d.tumorNo);
  }

  setTumorNo() {
    if (this.patientData.cancerList && this.patientData.cancerList.length) {
      this.state.cancer.tumorNo = Math.max(
        ...this.getTumorNos(this.patientData.cancerList)
      );
      this.state.cancer.tumorNo = this.state.cancer.tumorNo + 1;
    } else {
      this.state.cancer.tumorNo = 1;
    }
  }
  setPatientPersonId() {
    console.log("PATIENT NO : " + this.props.patientData.personID);
    this.state.cancer.patientPersonID = this.patientData.personID;
  }

  handleSaveAddCancer(event) {
    console.log(" Adding a cancer");
    event.preventDefault();

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      this.setTumorNo();
      this.setPatientPersonId();
      this.state.cancer.centerNo = 12;
      var addedList = [...this.patientData.cancerList, this.state.cancer];
      this.patientData.cancerList = addedList;
      this.setState({ showAddCancerDialog: false });
      this.setState({ validation });
      this.props.onSaveCancer(this.state.cancer);
      this.props.oncCloseCancer();

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

    var tissue = this.state.tissueData[e.target.value];
    cancerLocal.tissue = tissue;

    this.setState({
      cancer: cancerLocal,
      tissue: tissue.code
    });
  }

  setSiteSelected(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);

    let selectedObj = this.state.siteData.find(site => site.code == e);

    cancerLocal.site = selectedObj;

    this.setState({
      cancer: cancerLocal,
      site: selectedObj.code
    });
  }

  setSiteChanged(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.siteData.find(
      site => site.code == e.target.value
    );
    if (typeof selectedObj !== "undefined") {
      cancerLocal.site = selectedObj;

      this.setState({
        cancer: cancerLocal,
        site: selectedObj.code
      });
    } else {
      this.setState({
        site: e.target.value
      });
    }
  }

  setSiteSelected(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);

    let selectedObj = this.state.siteData.find(site => site.code == e);

    cancerLocal.site = selectedObj;

    this.setState({
      cancer: cancerLocal,
      site: selectedObj.code
    });
  }
  setHistology(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    var histo = this.state.histocodesData[e.target.value];
    cancerLocal.histology = histo.code;

    this.setState({
      cancer: cancerLocal,
      histology: histo.code
    });
  }
  setHistologySelected(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);

    let selectedObj = this.state.histocodesData.find(
      histology => histology.code == e
    );

    cancerLocal.histology = selectedObj.code;

    this.setState({
      cancer: cancerLocal,
      histology: selectedObj.code
    });
  }

  setHistologyChanged(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    let selectedObj = this.state.histocodesData.find(
      histology => histology.code == e.target.value
    );
    if (typeof selectedObj !== "undefined") {
      cancerLocal.histology = selectedObj.code;

      this.setState({
        cancer: cancerLocal,
        histology: selectedObj.code
      });
    } else {
      this.setState({
        histology: e.target.value
      });
    }
  }

  setDiagSource(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);

    var diagSource = this.state.diagSourceData[e.target.value];
    cancerLocal.diagSource = diagSource;

    this.setState({
      cancer: cancerLocal,
      diagSource: diagSource.id
    });
  }
  setBehaviour(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);

    var behaviour = this.state.behaviourcodesData[e.target.value];
    cancerLocal.behaviour = behaviour;

    this.setState({
      cancer: cancerLocal,
      behaviour: behaviour.code
    });
  }
  setLateral(e) {
    let cancerLocal = Object.assign({}, this.state.cancer);
    var lateral = this.state.latralcodeData[e.target.value];
    cancerLocal.lateral = lateral;

    this.setState({
      cancer: cancerLocal,
      lateral: lateral.code
    });
  }

  setAge(event) {
    if (event.target.validity.valid) {
      let cancerLocal = Object.assign({}, this.state.cancer);
      cancerLocal.ageDiagnosis = event.target.value;
      this.setState({
        cancer: cancerLocal,
        ageDiagnosis: event.target.value
      });
    }
  }
  validHistology = () => {
    let selectedObj = this.state.histocodesData.find(
      histology => histology.code == this.state.histology
    );
    if (typeof selectedObj !== "undefined") {
      return true;
    }
    {
      return false;
    }
  };

  validSite = () => {
    let selectedObj = this.state.siteData.find(
      site => site.code == this.state.site
    );
    if (typeof selectedObj !== "undefined") {
      return true;
    }
    {
      return false;
    }
  };

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
      if (this.state.isExistingBirthDate) {
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
      currentDate = new Date(parseInt(y), parseInt(m), 15);
    } else if (d != "99" && m == "99" && y != "9999") {
      currentDate = new Date(parseInt(y), 7, parseInt(d));
    } else if (d == "99" && m == "99" && y != "9999") {
      currentDate = new Date(parseInt(y), 7, 15);
    } else if (d != "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    }
    return currentDate;
  }

  componentDidMount() {
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
  }

  render() {
    var inlineclass = "inline-error-dialog ng-show-add-active ";
    var inlineclasshide = "inline-error-dialog ng-hide-add ng-hide-add-active";
    var errorDiv = {
      //display: "block",
      textAlign: "center",
      marginBottom: "5px",
      width: "100%"
    };
    var errorDivNone = {
      height: "0px"
    };
    let validation = this.submitted // if the form has been submitted at least once
      ? this.validator.validate(this.state) // then check validity every time we render
      : this.state.validation; // otherwise just use what's in state

    return (
      <div>
        <Modal
          backdrop={false}
          show={this.state.showAddCancerDialog}
          onHide={this.handleCloseAddCancer}
          keyboard={false}
          selectedid={this.state.selectedId}
          oncCloseCancer={this.handleCloseAddCancer}
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
                  <Autocomplete
                    wrapperStyle={{ width: "100%" }}
                    inputProps={{
                      style: {
                        width: "100%",
                        height: "42px",
                        border: "1px solid rgb(233, 211, 211)",
                        padding: "0 35px 0 19px",
                        color: "#999",
                        borderRadius: "4px"
                      },
                      placeholder: "Search Site"
                    }}
                    wrapperStyle={{ width: "100%" }}
                    className="form-control"
                    items={this.state.siteData}
                    shouldItemRender={(item, value) =>
                      item.code.toUpperCase().indexOf(value.toUpperCase()) > -1
                    }
                    getItemValue={item => item.code}
                    renderMenu={(items, value, style) => {
                      return (
                        <div
                          style={{
                            zIndex: "1",
                            backgroundColor: "f0eeec",
                            minWidth: "302.5px",
                            borderRadius: "3px",
                            boxShadow: " rgba(0, 0, 0, 0.1) 0px 2px 12px",
                            background: "rgba(255, 255, 255, 0.9)",
                            padding: "2px 0px; font-size: 90%",
                            position: "fixed",
                            overflow: "auto",
                            maxHeight: "50%"
                          }}
                          children={items}
                        />
                      );
                    }}
                    renderItem={(item, isHighlighted) => (
                      <div
                        style={{
                          background: isHighlighted ? "#f5f5f5" : "white"
                        }}
                        key={item.id}
                      >
                        {item.code + "   " + item.description}
                      </div>
                    )}
                    value={this.state.site}
                    //   onChange={this.setFamilyValue.bind(this)}
                    onChange={this.setSiteChanged.bind(this)}
                    onSelect={this.setSiteSelected.bind(this)}
                  />
                  <div
                    className={
                      validation.site.isInvalid ? inlineclass : inlineclasshide
                    }
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
                  >
                    <option>{"Choose One"}</option>
                    {this.state.latralcodeData.map((lateralList, i) => {
                      return (
                        <option key={i} value={i}>
                          {lateralList.description}
                        </option>
                      );
                    })
                    // <option >{"Hospital Rec"}</option>
                    }
                    }
                  </select>
                  <div
                    className={
                      validation.lateral.isInvalid
                        ? inlineclass
                        : inlineclasshide
                    }
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
                  <Autocomplete
                    wrapperStyle={{ width: "100%" }}
                    inputProps={{
                      style: {
                        width: "100%",
                        height: "42px",
                        border: "1px solid rgb(233, 211, 211)",
                        padding: "0 35px 0 19px",
                        color: "#999",
                        borderRadius: "4px"
                      },
                      placeholder: "Search Histology"
                    }}
                    wrapperStyle={{ width: "100%" }}
                    className="form-control"
                    items={this.state.histocodesData}
                    shouldItemRender={(item, value) =>
                      item.code.toUpperCase().indexOf(value.toUpperCase()) > -1
                    }
                    getItemValue={item => item.code}
                    renderMenu={(items, value, style) => {
                      return (
                        <div
                          style={{
                            zIndex: "1",
                            backgroundColor: "f0eeec",
                            minWidth: "302.5px",
                            borderRadius: "3px",
                            boxShadow: " rgba(0, 0, 0, 0.1) 0px 2px 12px",
                            background: "rgba(255, 255, 255, 0.9)",
                            padding: "2px 0px; font-size: 90%",
                            position: "fixed",
                            overflow: "auto",
                            maxHeight: "50%"
                          }}
                          children={items}
                        />
                      );
                    }}
                    renderItem={(item, isHighlighted) => (
                      <div
                        style={{
                          background: isHighlighted ? "#f5f5f5" : "white"
                        }}
                        key={item.id}
                      >
                        {item.code + "   " + item.description}
                      </div>
                    )}
                    value={this.state.histology}
                    //   onChange={this.setFamilyValue.bind(this)}
                    onChange={this.setHistologyChanged.bind(this)}
                    onSelect={this.setHistologySelected.bind(this)}
                  />
                  <div
                    className={
                      validation.histology.isInvalid
                        ? inlineclass
                        : inlineclasshide
                    }
                    style={
                      validation.histology.isInvalid ? errorDiv : errorDivNone
                    }
                  >
                    <ul>
                      <li className="validationMsg">
                        {validation.histology.message}
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
                  >
                    <option>{"Choose One"}</option>
                    {this.state.behaviourcodesData.map(
                      (behaviourcodesList, i) => {
                        return (
                          <option key={i} value={i}>
                            {behaviourcodesList.description}
                          </option>
                        );
                      }
                    )}
                  </select>
                  <div
                    className={
                      validation.behaviour.isInvalid
                        ? inlineclass
                        : inlineclasshide
                    }
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
                    name="diagDateNewColumn"
                    onSelectYear={this.handleYearPickedDiag}
                    onSelectMonth={this.handleMonthPickedDiag}
                    onSelectDate={this.handleDatePickedDiag}
                  />

                  <div
                    className={
                      validation.dateOfDiagnosis.isInvalid
                        ? inlineclass
                        : inlineclasshide
                    }
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
                <div className="col-sm-5 control-margin asteric-required">
                  Age Of Diagnosis:
                </div>
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
                    className={
                      validation.ageDiagnosis.isInvalid
                        ? inlineclass
                        : inlineclasshide
                    }
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
                <div className="col-sm-5 control-margin asteric-required">
                  Source:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    className="form-control-modal"
                    onChange={this.setDiagSource.bind(this)}
                    name="currentDeathColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.diagSourceData.map((diagSourceList, i) => {
                      return (
                        <option key={i} value={i}>
                          {diagSourceList.description}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    className={
                      validation.diagSource.isInvalid
                        ? inlineclass
                        : inlineclasshide
                    }
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
                <div className="col-sm-5 control-margin asteric-required">
                  Tissue:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    className="form-control-modal"
                    onChange={this.setTissue.bind(this)}
                    name="currentDeathColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.tissueData.map((tissueList, i) => {
                      return (
                        <option key={i} value={i}>
                          {tissueList.description}
                        </option>
                      );
                    })}
                  </select>
                  <div
                    className={
                      validation.tissue.isInvalid
                        ? inlineclass
                        : inlineclasshide
                    }
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
                Cancel
              </button>
              {/* <Button onClick={this.handleCloseAddCancer} >Close</Button> */}
              {/* <button  disabled={isSubmitting}>Save</button> */}
              {/* <button  type= "submit" disabled={isSubmitting}>Save</button> */}
              {/* <Button disabled= {!this.state.enableSaveButton} onClick={this.handleSave}>Save</Button> */}

              <Button
                style={{ width: "170px" }}
                className="btn btn-primary"
                onClick={this.handleSaveAddCancer.bind(this)}
              >
                Save And Return
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    );
  }
}
