import React from "react";
import {
  Button,
  DropdownButton,
  MenuItem,
  Modal,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import DatePicker from "react-date-picker";
import "../../App.css";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import { properties } from "../../properties.js";
import cloneDeep from "lodash/cloneDeep";
import FormValidator from "../validator/FormValidator";
import DateSelect from "../util/DateSelect";
import Autocomplete from "react-autocomplete";
import HeaderPanel from "../HeaderPanel";

// import ExampleModal from '../steps/ExampleModal';

class CancerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.validator = new FormValidator([
      {
        field: "ageDiagnosisFromDb",
        method: "isEmpty",
        validWhen: false,
        message: "Age is required."
      },
      {
        field: "dateOfDiagFromDb",
        method: this.validateDiagnosisDate,
        validWhen: true,
        message: "Dx Date should be greater than DOB and less than Death Date"
      }
      // {
      //   field: 'email',
      //   method: 'isEmail',
      //   validWhen: true,
      //   message: 'That is not a valid email.'
      // },
    ]);
    this.state = {
      patientData: null,
      patientDataObject: [],
      cancerInfo: [],
      selectedPersonData: [],

      // validation fields
      ageDiagnosisFromDb: "",
      dateOfDiagFromDb: "",

      show: false,
      showAddCancer: false,
      isCancerEdited: false,
      isCanecerAdded: false,
      currentSourceOFDeath: 2,
      dodExist: false,
      familyData: [],

      selectedId: "",

      //Edit Modal Dialog variables
      isArrayEmpty: false,
      // cancerInfoEdited:[{id:'',age:'',complaints:''}],
      cancerInfoEdited: [
        {
          id: "",
          site: { id: "", code: "", description: "" },
          complaints: ""
        }
      ],
      // cancerInfoEdited: new  Object,
      tumorNo: "",
      siteData: [],
      latralcodeData: [],
      histocodesData: [],
      behaviourcodesData: [],
      ageDiagnosisData: [],
      diagSourceData: [],
      tissueData: [],
      siteEditDlg: "",
      siteDescription: "",
      siteId: "",
      lateralFromDb: "",
      histocodesFromDb: "",
      behaviourcodesFromDb: "",
      dateOfDiagFromDb: "",
      ageDiagnosisFromDb: "",
      diagSourceFromDb: "",
      tissueFromDb: "",
      changedParameters: [],
      cancerInfoCopy: [],
      enableSaveButton: false, // this should be modified to 'true' when each and every individual field is modified in the dialog

      selectedEditYear: "",
      selectedEditMonth: "",
      selectedEditDate: "",

      // Add Cancer dialog variables
      newSiteValue: "",
      newCancerArr: [], // Used to get the New Cancer to the "Preview Screen" , AND (In recordEditedData()) to filter the Edited records from new recs )
      newCancerObject: new Object(),
      newSite: new Object(),
      newLateral: new Object(),
      newHisto: new Object(),
      newBehavior: new Object(),
      newSource: new Object(),
      newTissue: new Object(),
      newTumerNoArr: [],
      isNewCancer: false, // To distinguish between "Edited" AND "New Cancer"
      // newLateral : new Object,
      // newLateral : new Object,

      // Object Array
      changedColumn: {
        id: "",
        column: "",
        previousVal: "",
        newVal: ""
      },

      arrayEditedData: [],
      arrayEditedParam: [],
      editedRecordCount: 0,

      newCancerModalId: "",
      // ageOfDiagColumn: '',
      validation: this.validator.valid()
    };

    this.submitted = false;

    this.handleShow = this.handleShow.bind(this);
    this.handleShowAddCancer = this.handleShowAddCancer.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCloseAddCancer = this.handleCloseAddCancer.bind(this);
    this.handleSaveAddCancer = this.handleSaveAddCancer.bind(this);

    this.handleSaveEditCancer = this.handleSaveEditCancer.bind(this);
    this.handleTxtChange = this.handleTxtChange.bind(this);
    this.setCurrentSource = this.setCurrentSource.bind(this);
    this.state.patientData = this.props.patientDataValue;
    this.convertToGetDate = this.convertToGetDate.bind(this);


    // this.handleSubmit = this.handleSubmit.bind(this);
    // handleSubmit
  }
  // componentDidUpdate() {
  //   // componentWillMount() {
  //   // componentWillUpdate  () {

  // }

  convertToGetDate(date) {
    var formatDatestr = date;
    // console.log( "year: "+ str.slice(0,4) )
    // console.log( "mon: "+ str.slice(4,6) )
    // console.log( "date: "+ str.slice(6,8) )

    // formatDatestr = formatDatestr!=null ? formatDatestr : 0;
    if (formatDatestr != null) {

      var year = formatDatestr.slice(0, 4);
      var month = formatDatestr.slice(4, 6);
      var date = formatDatestr.slice(6, 8)

      formatDatestr = year + "," + month + "," + date;

    } else formatDatestr = "N/A";
    console.log("formatDatestr : " + formatDatestr)

    formatDatestr = this.getDate(date, month, year);
    return formatDatestr;

  }

  getDate(d, m, y) {
    console.log("getDate Month : " + m)
    var currentDate;
    if (d == "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m), 15);
      // currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));

      console.log("if---1 : " + currentDate)
    } else if (d != "99" && m == "99" && y != "9999") {
      currentDate = new Date(parseInt(y), 7, parseInt(d));
      console.log("if---2 : " + currentDate)

    } else if (d == "99" && m == "99" && y != "9999") {
      currentDate = new Date(parseInt(y), 7, 1);
      console.log("if---3 : " + currentDate)

    } else if (d != "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      console.log("if---4 : " + currentDate)

    }
    return currentDate;
  }

  validateDiagnosisDate = () => {
    // var currentDeathDate = this.getDate(d, m, y);
    var currentDeathDate = this.convertToGetDate(this.state.selectedPersonData.dateOfDeath);

    // if (this.state.isValidLKDSelected) {
    var currentLKDDate = this.getDate(
      this.state.selectedEditDate,
      this.state.selectedEditMonth,
      this.state.selectedEditYear,
    );

    if (
      typeof currentLKDDate !== "undefined" &&
      typeof currentDeathDate !== "undefined"
    ) {
      if (currentDeathDate > currentLKDDate) {
        console.log("In validateDiagnosisDate() ")
        return true;
        // errors.currentdodColumn =
        //   "Death date should be greater than LKD date";
      } else return false
    }

  }
  negativeAge = () => {
    console.log("In Negative : " + this.state.ageDiagnosisFromDb);
    console.log("In Negative : " + this.state.selectedPersonData.dateOfDeath);
    console.log("In Negative : " + this.state.dateOfDiagFromDb);

    var locaDoDeath = this.convertToGetDate(this.state.selectedPersonData.dateOfDeath);
    // new Date(this.convertDateFormat(this.state.selectedPersonData.dateOfDeath));
    var locaDoDiag = this.convertToGetDate(this.state.dateOfDiagFromDb);
    // new Date(this.convertDateFormat(this.state.dateOfDiagFromDb));
    console.log("locaDoDeath : " + locaDoDeath);
    console.log("locaDoDiag : " + locaDoDiag);
    console.log("In Negative difference: " + Math.floor((locaDoDeath - locaDoDiag) / 31536000000));

    console.log(
      "In Negative :  dateOfDeath: " +
      new Date(
        this.convertDateFormat(this.state.selectedPersonData.dateOfDeath)
      )
    );

    console.log(
      "In Negative : dateOfDiagFromDb  : " +
      new Date(this.convertDateFormat(this.state.dateOfDiagFromDb))
    )

    // Math.floor((dodiag - dob) / 31536000000);
    if (Math.floor((locaDoDeath - locaDoDiag) / 31536000000) > 0) {
      console.log("dateOfDeath is greater TRUE")
      return true;
    } else {
      console.log("dateOfDeath is greater FALSE")
      return false;
    }
    if (this.state.ageDiagnosisFromDb < 0) {
      console.log("dateOfDeath is greater")
      return true;
    } else {
      console.log("dateOfDeath is lesser")

      return false;
    }

  };

  componentDidMount() {
    if (this.state.dateOfDiagFromDb != "") {
      console.log(
        "dateOfDiagFromDb componentDidMount : " + this.state.dateOfDiagFromDb
      );
      this.setState({
        dodExist: true
      });
    }
    this.state.editedRecordCoun = this.props.editedRecordCoun;
    // if(this.props.editedRecordCoun=='undefined'){

    //   this.state.editedRecordCoun= 0;
    // }else {
    // }
    console.log(
      "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL" +
      this.props.editedRecordCount
    );
    console.log(
      "LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL Length" +
      this.state.arrayEditedData.length
    );

    // const urlProfession = properties.baseUrl + "practitionerscore/" ;
    // fetch saved practitioner rec id

    // const urlCancerInfo = properties.baseUrl + "patients/" + personID + "cancers";
    //TODO - remove the hard code
    // const urlCancerInfo = properties.baseUrl + "patients/" + "121000186001" + "/cancers";
    // fetch(urlCancerInfo)
    //   .then(response => response.json())
    //   .then((data) => {

    //     this.setState({
    //       cancerInfo: data,

    //     });

    // })

    // Assigning the patient object to local variables
    // var OldCancerList = this.props.patientDataValue.cancerList;
    this.state.patientDataObject = this.props.patientDataValue;
    this.state.cancerInfo = this.props.patientDataValue.cancerList;
    this.state.newCancerArr = this.props.newCancerArr;

    //ToDo make this an async call , should load before the edit dialog , (if not there will be no data to be set to the previous values.)
    // cancerInfoCopy will keep data from the database, It will not change with the modified values. this is used in the "Preview" screen to show the 'previous' values
    this.getPatientDetails();
    // if(this.state.selectedPersonData.)
    // this.setState({ cancerInfoCopy: this.state.selectedPersonData.cancerList })

    this.state.newCancerModalId = Math.floor(Math.random() * 10);
    console.log(
      "site &&&&&&&&&&&&&&&&&&&&&77 intGender : " +
      this.props.patientDataValue.intGender
    );

    console.log(
      "site &&&&&&&&&&&&&&&&&&&&&77" +
      this.props.patientDataValue.cancerList[0].id
    );
    // this.state.profession.push(data);

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

        fetch(urlfamilyId)
          .then(response => response.json())
          .then(data => {
            // console.log(data);
            this.setState({
              familyData: data
            });
            // this.state.profession.push(data);
            // console.log("data :" +data);
          })
          .catch(error => {
            console.log("Error :");

            document.write("Error : " + error);
          });
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

    const urlSource = properties.baseUrl + "srlcodes";
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

  getPatientDetails() {
    console.log(
      "patientId getPatientDetails" + this.state.patientDataObject.personCID
    );

    const urlpatients =
      properties.baseUrl + "patients/" + this.state.patientDataObject.personCID;
    fetch(urlpatients)
      .then(response => response.json())
      .then(data => {
        this.setState({
          selectedPersonData: data
        });
        console.log("pdata" + this.state.selectedPersonData.personCID);
        // this.props.onInsertPatientId(this.state.selectedPersonData)
        // this.assignDbDataToFields()
        // this.state.profession.push(data);
      })
      .catch(error => {
        document.write("Error : " + error);
      });
  }

  // handleSubmit() {
  //   console.log("in handleSubmit AAAA" )

  //   this.setState({ showAddCancer: false });
  //   // this.setState({ showAddCancer: false });
  // }
  handleClose() {
    this.setState({ show: false });

    //Disable the save button when closing the dialog
    this.state.enableSaveButton = false;
    // this.setState({ showAddCancer: false });
  }
  handleSaveEditCancer = event => {
    // console.log("in handleSave" + this.state.cancerInfo[200].age)
    console.log("in handleSave tumorNo " + this.state.tumorNo);

    const validation = this.validator.validate(this.state);
    this.setState({ validation });
    this.submitted = true;

    if (validation.isValid) {
      // alert("All Valid ")
      console.log("Form Valid ");
      // handle actual form submission here
      this.recordEditedData();
      // alert("Saving" + this.state.cancerInfo[this.state.selectedId].age)
      this.setState({ show: false });
    } else {
      // alert("NOT Valid ");
    }
  };
  //capture edited records and compair with the original data
  recordEditedData() {
    // this.state.cancerInfoEdited = this.state.cancerInfo;
    // this.state.cancerInfoEdited[this.state.tumorNo] = JSON.parse(JSON.stringify(this.state.cancerInfo));
    this.state.cancerInfoEdited[this.state.tumorNo] = [
      ...this.state.cancerInfo[this.state.tumorNo]
    ];
    // this.state.changedParameters[this.state.tumorNo] = [...this.state.cancerInfo[this.state.tumorNo]];
    // this.state.changedParameters[this.state.tumorNo] = JSON.parse(JSON.stringify(this.state.cancerInfo));
    // this.state.changedParameters[this.state.tumorNo] = cloneDeep(this.state.cancerInfo[this.state.tumorNo]);
    // this.state.cancerInfoCopy[this.state.tumorNo] = cloneDeep(this.state.cancerInfo[this.state.tumorNo]);
    // this.state.cancerInfoCopy = this.props.patientDataValue.cancerList;

    // this.setState({ changedParameters:JSON.parse(JSON.stringify(this.state.cancerInfo)) });
    if (!this.state.isArrayEmpty) {
      // this.makeEmptyArray();
    }

    // Condition added To avoid displaying changes in Newly added cancers in "Updated Cancer Details" section in 'Preview' screen
    console.log(
      "TUMORNO EQUAL " + this.state.cancerInfo[this.state.tumorNo].tumorNo
    );
    console.log("TUMORNO EQUAL " + this.state.newCancerObject.tumorNo);
    // console.log("TUMORNO EQUAL " + this.state.cancerInfoCopy.tumorNo)
    this.state.isNewCancer = false;
    // Looping through New Cancer Array ,
    // When displaying the changed values in 'Preview' screen, to avoid displaying new records as edited
    // newTumerNoArr
    this.state.newCancerArr.map((values, i) => {
      console.log("tumor_no : " + values.tumorNo);
      if (values.tumorNo == this.state.cancerInfo[this.state.tumorNo].tumorNo) {
        this.state.isNewCancer = true;
      }
    });
    console.log("isNewCancer : " + this.state.isNewCancer);
    //Set the parameter isNewCancer true if the "newCancerArr" map has new elements from above loop. else set false
    this.setState({ isNewCancer: this.state.isNewCancer });

    this.createEditedArray();
    // Conditioning only to display edited cancers in preview , to avoid New cancer displayed as edited
    if (!this.state.isNewCancer) {
      this.getChangedFieldsOnly();
    }

    // var eq = JSON(this.state.cancerInfoEdited) == JSON(this.state.cancerInfo);

    // console.log("eq  : " + eq)
  }

  makeEmptyArray() {
    this.state.changedParameters.map((values, i) => {
      values.age = "";
      values.complaints = "";
      values.location = "";
      values.score = "";
      values.sex = "";
      values.specialty = "";
      values.specificcomplaint = "";
      values.issuetype = "";
      values.risk = "";
    });
    this.state.isArrayEmpty = true;
  }

  // This arrary "changedParameters" is declared to capture only the changed values from the Edit dialog.
  //ToDO
  createEditedArray() {
    // console.log("in handleSave tumorNo early"  + this.state.cancerInfoEdited[this.state.tumorNo].site.code)

    // console.log("in handleSave tumorNo before"  + this.state.cancerInfoEdited[this.state.tumorNo].site.code)
    console.log(
      "in handleSave tumorNo before" +
      this.state.cancerInfo[this.state.tumorNo].site.code
    );

    // if(this.state.siteEditDlg!="undefined"){
    if (
      this.state.cancerInfoCopy[this.state.tumorNo].site.code !=
      this.state.siteEditDlg
    ) {
      this.setSiteDataForEditDialog();
      // this.state.cancerInfoEdited[this.state.tumorNo].location= 44
    }
    if (
      this.state.cancerInfoCopy[this.state.tumorNo].lateral.description !=
      this.state.lateralFromDb
    ) {
      console.log("lateral changed ***********" + this.state.lateralFromDb);
      this.setLateralDataForEditDialog();
    }

    // TODo uncomment code after histology values added to the patient data
    // if(this.state.cancerInfoCopy[this.state.tumorNo].histology.code != this.state.histocodesFromDb){
    //   console.log("lateral changed ***********" + this.state.histocodesFromDb)
    //   this.setHistoDataForEditDialog();
    // }
    if (
      this.state.cancerInfoCopy[this.state.tumorNo].behaviour.description !=
      this.state.behaviourcodesFromDb
    ) {
      console.log(
        "lateral changed ***********" + this.state.behaviourcodesFromDb
      );
      this.setbehaviourDataForEditDialog();
    }

    if (
      this.state.cancerInfoCopy[this.state.tumorNo].dateOfDiagnosis !=
      this.state.selectedEditYear +
      this.state.selectedEditMonth +
      this.state.selectedEditDate
    ) {
      console.log("IN createEditedArray : ");
      this.state.dateOfDiagFromDb =
        this.state.selectedEditYear +
        this.state.selectedEditMonth +
        this.state.selectedEditDate;
      console.log("IN createEditedArray : " + this.state.dateOfDiagFromDb);

      this.setDODForEditDialog();
      // this.state.patientDataValue.dateOfBirth = (this.state.patientDataValue.dateOfBirth == '' ? '' : (this.state.currentDOB));
    }
    if (
      this.state.cancerInfoCopy[this.state.tumorNo].ageDiagnosis !=
      this.state.ageDiagnosisFromDb
    ) {
      console.log(
        "lateral changed ***********" + this.state.ageDiagnosisFromDb
      );
      this.setAODDataForEditDialog();
    }
    if (
      this.state.cancerInfoCopy[this.state.tumorNo].diagSource.description !=
      this.state.diagSourceFromDb
    ) {
      console.log(
        "Diag Source changed ***********" + this.state.diagSourceFromDb
      );
      this.setDiagSourdeDataForEditDialog();
    }
    if (
      this.state.cancerInfoCopy[this.state.tumorNo].tissue.description !=
      this.state.tissueFromDb
    ) {
      console.log("tissue changed ***********" + this.state.tissueFromDb);
      this.setTissueDataForEditDialog();
    }

    console.log("in " + this.state.siteEditDlg);
    console.log(
      "in handleSave age afterin handleSave age after" +
      this.state.cancerInfo[this.state.tumorNo].site.id
    );
    console.log(
      "in handleSave age afterin changedParameters age after" +
      this.state.cancerInfoCopy[this.state.tumorNo].site.code
    );
    // console.log("in handleSave age afterin handleSave age after" + this.state.cancerInfoEdited[this.state.tumorNo].site.description)
    console.log("in handleSave age tumor No" + this.state.tumorNo);

    // console.log("in handleSave complaints after" + this.state.cancerInfoEdited[this.state.tumorNo].complaints)
    // console.log("in handleSave location after" + this.state.cancerInfoEdited[this.state.tumorNo].location  )
  }

  getChangedFieldsOnly() {
    if (
      JSON.stringify(this.state.cancerInfoEdited[this.state.tumorNo]) ==
      JSON.stringify(this.state.cancerInfo[this.state.tumorNo])
    ) {
      console.log("if equal");
    } else {
      this.state.isCancerEdited = true;
      console.log("Not equal : " + this.state.tumorNo);
      console.log(
        "Not equal nn" + this.state.cancerInfo[this.state.tumorNo].age
      );
      console.log(
        "Not equal ed  :" + this.state.cancerInfoEdited[this.state.tumorNo].age
      );

      /** Looping to get all the parameters of the object "cancerInfoEdited" using param (***)
       * Creating a new Object every time the save is pressed - if not it will update to the same last object every time
       *  This will capture all the changed fields in the Edit dialog box and put into the 'arrayEditedData'
       *  Complex Array ====> (arrayEditedData [arrayEditedParam{Object cancerInfo}]) **/
      // this.state.arrayEditedData[this.state.tumorNo] = [...this.state.arrayEditedData[this.state.tumorNo]];

      /**  This will be in play when back is pressed in "Preview" screen, will add new records on top of previous values. **/
      if (this.props.arrayEditedData != undefined) {
        this.state.arrayEditedData = this.props.arrayEditedData;
        // this.setState((prevState, props) => ({
        //   arrayEditedData: [this.state.arrayEditedData,...prevState.arrayEditedData]
        // }));
      }

      var EditedParam = new Array();
      for (var param in this.state.cancerInfoEdited[this.state.tumorNo]) {
        var changeCol = new Object();
        // console.log(param + ':: ' + this.state.cancerInfo[this.state.tumorNo][param]);
        // console.log(param + ':: ' + this.state.cancerInfoEdited[this.state.tumorNo][param]);
        changeCol.column = param;
        changeCol.previousVal = this.state.cancerInfoCopy[this.state.tumorNo][
          param
        ];
        changeCol.newVal = this.state.cancerInfoEdited[this.state.tumorNo][
          param
        ];

        if (param == "site") {
          changeCol.column = "Site";
          changeCol.previousVal = changeCol.previousVal.code;
          console.log(
            "--------------------------------" + changeCol.previousVal
          );
        }
        if (param == "lateral") {
          changeCol.column = "Lateral";
          changeCol.previousVal = changeCol.previousVal.description;
        }
        if (param == "histology") {
          changeCol.column = "Histology";
          changeCol.previousVal = changeCol.previousVal.code;
        }
        if (param == "behaviour") {
          changeCol.column = "Behaviour";
          console.log(
            "--------------------------------" + changeCol.previousVal
          );
          changeCol.previousVal = changeCol.previousVal.description;
        }
        if (param == "ageDiagnosis") {
          changeCol.column = "Age Of Diagnosis";
          console.log(
            "--------------------------------" + changeCol.previousVal
          );
          changeCol.previousVal = changeCol.previousVal;
        }
        if (param == "diagSource") {
          changeCol.column = "Source";
          console.log(
            "--------------------------------" + changeCol.previousVal
          );
          changeCol.previousVal = changeCol.previousVal.description;
        }
        if (param == "tissue") {
          changeCol.column = "Tissue";
          console.log(
            "--------------------------------" + changeCol.previousVal
          );
          changeCol.previousVal = changeCol.previousVal.description;
        }

        console.log("PARAM edited" + param);
        EditedParam[this.state.editedRecordCount] = changeCol;
        this.state.editedRecordCount++;
      }

      // EditedParam = this.setLiveDateInfoForPreview(
      //   this.state.editedRecordCount,
      //   EditedParam
      // );
      // console.log("before i /////////////////////////////// : " )

      this.state.arrayEditedData[this.state.tumorNo] = EditedParam;
    }
    this.sendEditedCancerToPreview();
  }
  setLiveDateInfoForPreview(editedRecordCount, EditedParam) {
    var changeCol = new Object();
    changeCol.column = "Live Date";
    changeCol.previousVal = this.state.cancerInfoCopy[
      this.state.tumorNo
    ].dateOfDiagnosis;
    changeCol.newVal = this.state.cancerInfoCopy[
      this.state.tumorNo
    ].dateOfDiagnosis;
    return (EditedParam[editedRecordCount] = changeCol);
  }
  sendNewCancerToPreview() {
    this.state.newCancerArr.map(
      (values, i) => console.log("site values :" + values.site.id)
      // console.log("site values :" +values.site),
      // console.log("site values :" + values.Lateral)
    );
    // Sending the modified patient with added cancer object to be saved to main page(cancerFamily)
    this.state.patientDataObject.cancerList = this.state.cancerInfo;

    this.props.onSaveNewInfo(
      this.state.newCancerArr,
      this.state.patientDataObject,
      this.state.isCanecerAdded
    );
  }
  sendEditedCancerToPreview() {
    this.state.arrayEditedData.map((values, i) => {
      // console.log("i : " + values)
      // values.map((values,i)=>{
      // console.log("i : " + i)
      // if(values.column=="site"){
      //   console.log("previousVal : " + values.previousVal.code)
      // }if(values.column=="lateral"){
      //   console.log("previousVal : " + values.previousVal.code)
      // }else{
      //   console.log("previousVal : " + values.previousVal)
      // }
      //   console.log("newVal: " + values.newVal)
      // })
    });

    // Sending the modified patient object to be saved to main page(cancerFamily)
    this.state.patientDataObject.cancerList = this.state.cancerInfo;

    console.log(
      "patientDataObject IntGender : " + this.state.patientDataObject.intGender
    );

    // console.log("##################### in can info :: " + this.state.cancerInfo[1].site.code)

    this.props.onSaveChangeInfo(
      this.state.arrayEditedData,
      this.state.isCancerEdited,
      this.state.patientDataObject
    );
  }

  // ToDo remove this function since the same can be achived with the function setParamDescANDId
  // setHistoCodeANDDesc(code){
  //     this.state.histocodesData.map((values,i)=>{
  //       if(values.code== code){
  //             console.log("siteData : "+ values.description);
  //             this.state.cancerInfo[this.state.tumorNo].site.description = values.description
  //             this.state.cancerInfo[this.state.tumorNo].site.id = values.id
  //         }
  //     })
  // }

  // ToDo can be removed
  // setLateralCodeANDId(description){
  //     this.state.latralcodeData.map((values,i)=>{
  //         // console.log("siteData : "+ values.id);
  //         if(values.description== description){
  //           console.log("lateralData : "+ values.description);
  //           this.state.cancerInfo[this.state.tumorNo].lateral.code = values.code
  //           this.state.cancerInfo[this.state.tumorNo].lateral.id = values.id
  //       }
  //     })
  //   }

  setParamCodeANDId(description, dataFromFetch) {
    var fieldValues;
    dataFromFetch.map((values, i) => {
      if (values.description == description) {
        console.log("lateralData : " + values.description);
        fieldValues = values;
      }
    });
    return fieldValues;
  }

  setParamDescANDId(code, dataFromFetch) {
    var fieldValues;
    dataFromFetch.map((values, i) => {
      if (values.code == code) {
        console.log("siteData : " + values.description);
        fieldValues = values;
      }
    });
    return fieldValues;
  }
  setSiteDataForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].site.code = this.state.siteEditDlg;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].site = this.state.siteEditDlg;
    var fieldValues = this.setParamDescANDId(
      this.state.cancerInfo[this.state.tumorNo].site.code,
      this.state.siteData
    );
    this.state.cancerInfo[this.state.tumorNo].site.description =
      fieldValues.description;
    this.state.cancerInfo[this.state.tumorNo].site.id = fieldValues.id;
  }
  setLateralDataForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].lateral.description = this.state.lateralFromDb;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].lateral = this.state.lateralFromDb;
    var fieldValues = this.setParamCodeANDId(
      this.state.cancerInfo[this.state.tumorNo].lateral.description,
      this.state.latralcodeData
    );

    this.state.cancerInfo[this.state.tumorNo].lateral.code = fieldValues.code;
    this.state.cancerInfo[this.state.tumorNo].lateral.id = fieldValues.id;
  }
  setHistoDataForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].histology.code = this.state.histocodesFromDb;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].histology = this.state.histocodesFromDb;
    // this.setHistoCodeANDDesc(this.state.cancerInfo[this.state.tumorNo].histology.code)
    var fieldValues = this.setParamDescANDId(
      this.state.cancerInfo[this.state.tumorNo].site.code,
      this.state.siteData
    );
    this.state.cancerInfo[this.state.tumorNo].histology.description =
      fieldValues.description;
    this.state.cancerInfo[this.state.tumorNo].histology.id = fieldValues.id;
  }
  setbehaviourDataForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].behaviour.description = this.state.behaviourcodesFromDb;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].behaviour = this.state.behaviourcodesFromDb;
    // this.setParamCodeANDId(this.state.cancerInfo[this.state.tumorNo].behaviour.description,this.state.behaviourcodesData)

    var fieldValues = this.setParamCodeANDId(
      this.state.cancerInfo[this.state.tumorNo].behaviour.description,
      this.state.behaviourcodesData
    );

    this.state.cancerInfo[this.state.tumorNo].behaviour.code = fieldValues.code;
    this.state.cancerInfo[this.state.tumorNo].behaviour.id = fieldValues.id;
  }
  setDODForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].dateOfDiagnosis = this.state.dateOfDiagFromDb;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].dateOfDiagnosis = this.state.dateOfDiagFromDb;
  }
  setAODDataForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].ageDiagnosis = this.state.ageDiagnosisFromDb;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].ageDiagnosis = this.state.ageDiagnosisFromDb;
    // this.setParamCodeANDId(this.state.cancerInfo[this.state.tumorNo].behaviour.description,this.state.behaviourcodesData)

    // var fieldValues = this.setParamCodeANDId(this.state.cancerInfo[this.state.tumorNo].behaviour.description, this.state.behaviourcodesData)

    // this.state.cancerInfo[this.state.tumorNo].behaviour.code = fieldValues.code
    // this.state.cancerInfo[this.state.tumorNo].behaviour.id = fieldValues.id
  }
  setDiagSourdeDataForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].diagSource.description = this.state.diagSourceFromDb;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].diagSource = this.state.diagSourceFromDb;
    // this.setDiagSourceCodeANDId(this.state.cancerInfo[this.state.tumorNo].diagSource.description,this.state.diagSourceData)
    var fieldValues = this.setParamCodeANDId(
      this.state.cancerInfo[this.state.tumorNo].diagSource.description,
      this.state.diagSourceData
    );

    this.state.cancerInfo[this.state.tumorNo].diagSource.code =
      fieldValues.code;
    this.state.cancerInfo[this.state.tumorNo].diagSource.id = fieldValues.id;
  }
  setTissueDataForEditDialog() {
    this.state.cancerInfo[
      this.state.tumorNo
    ].tissue.description = this.state.tissueFromDb;
    this.state.cancerInfoEdited[
      this.state.tumorNo
    ].tissue = this.state.tissueFromDb;
    // this.setParamCodeANDId(this.state.cancerInfo[this.state.tumorNo].tissue.description,this.state.tissueData)

    var fieldValues = this.setParamCodeANDId(
      this.state.cancerInfo[this.state.tumorNo].tissue.description,
      this.state.tissueData
    );

    this.state.cancerInfo[this.state.tumorNo].tissue.code = fieldValues.code;
    this.state.cancerInfo[this.state.tumorNo].tissue.id = fieldValues.id;
  }

  handleCloseAddCancer() {
    console.log(" cancelled adding a cancer");
    this.setState({ showAddCancer: false });
    // this.props.onOpenDialog("false");
    // this.setState({ showAddCancer: false });
  }
  handleSaveAddCancer() {
    console.log(" Adding a cancer");
    this.createNewCancerArray();
    this.sendNewCancerToPreview();
    this.setState({ showAddCancer: false });
    // alert("Saving" + this.state.cancerInfo[this.state.selectedId].age)
    // this.setState({ showAddCancer: false });
  }
  handleShowAddCancer(id) {
    // console.log("in handleShow"+  id )
    // this.setState({ show: false });
    this.state.selectedId = id;
    this.setState({ showAddCancer: true });
    // this.state.selectedId=id
    console.log("in handleShow selectedId ;" + this.state.selectedId);
  }
  handleTxtChange(e) {
    //alert("txt" + e.target.value)
    // this.state.textValue= e.target.value;
    this.setState({ textValue: e.target.value });
  }

  // Edit Modal Dialog functions
  handleShow(id) {
    console.log("in handleShow" + id);
    console.log("in siteEditDlg" + this.state.siteEditDlg);
    console.log("handleShow RECORD COUNT " + this.state.editedRecordCount);

    this.setState({ show: true });
    // this.setState({ showAddCancer: true });
    this.state.selectedId = id;
    // this will be the unique id of the selected record.
    this.state.tumorNo = id;
    console.log("in handleShow selectedId ;" + this.state.selectedId);

    this.loadDataToEditDialog(id);
  }

  // Values set in here will be displayed in the 'select' boxes in the Edit dialog
  loadDataToEditDialog(id) {
    this.setState({ cancerInfoCopy: this.state.selectedPersonData.cancerList });
    console.log("loadDataToEditDialog TUmorNo : " + id);
    console.log(
      "loadDataToEditDialog TUmorNo : " +
      this.state.selectedPersonData.personCID
    );
    //ToDu
    // save the changed row in to an array , this will be compaired with the original data in the review.
    // this.state.siteEditDlg= this.state.cancerInfo[id].site.code
    this.setState({ siteEditDlg: this.state.cancerInfo[id].site.code });
    // + " | " +this.state.cancerInfo[id].site.description     })
    this.setState({
      lateralFromDb: this.state.cancerInfo[id].lateral.description
    });
    // Remove comment
    // this.setState({ histocodesFromDb : this.state.cancerInfo[id].histology.code + " | " +this.state.cancerInfo[id].histology.description     })
    this.setState({
      behaviourcodesFromDb: this.state.cancerInfo[id].behaviour.description
    });
    this.setState({
      dateOfDiagFromDb:
        this.state.cancerInfo[id] != ""
          ? this.state.cancerInfo[id].dateOfDiagnosis
          : ""
    });

    console.log(
      "dateOfDiagFromDb : " + this.state.cancerInfo[id].dateOfDiagnosis
    );
    if (this.state.cancerInfo[id].dateOfDiagnosis != "") {
      this.setState({
        selectedEditYear: this.state.cancerInfo[id].dateOfDiagnosis.substr(0, 4)
      });
      this.setState({
        selectedEditMonth: this.state.cancerInfo[id].dateOfDiagnosis.substr(
          4,
          2
        )
      });
      this.setState({
        selectedEditDate: this.state.cancerInfo[id].dateOfDiagnosis.substr(6, 2)
      });
      console.log("selectedEditDate : " + this.state.selectedEditDate);
    }

    this.setState({
      ageDiagnosisFromDb: this.state.cancerInfo[id].ageDiagnosis
    });
    this.setState({
      diagSourceFromDb: this.state.cancerInfo[id].diagSource.description
    });
    this.setState({
      tissueFromDb: this.state.cancerInfo[id].tissue.description
    });

    console.log(
      "siteEditDlg behaviourcodesFromDb' diagSourceFromDbFromDb" +
      this.state.diagSourceFromDb
    );
  }
  setCurrentSource() {
    console.log(
      "setCurrentSource  setCurrentSource setCurrentSourcsetCurrentSource"
    );
  }
  /**START --  Add Cancer Dialog - Handle functions */
  setIdANDDescForAddDialog(dataField, code, dataFromFetch) {
    dataFromFetch.map((values, i) => {
      if (values.code == code) {
        console.log("siteData : " + values.description);
        dataField.description = values.description;
        dataField.id = values.id;
        dataField.code = values.code;
      }
    });
  }
  setIdANDcodeForAddDialog(dataField, description, dataFromFetch) {
    dataFromFetch.map((values, i) => {
      if (values.description == description) {
        console.log("siteData : " + values.description);
        dataField.description = values.description;
        dataField.id = values.id;
        dataField.code = values.code;
      }
    });
  }

  setSiteNewOnChange(event) {
    // console.log("Site :" + value);
    console.log("Site :" + event.target.value);
    // siteEditDlg: event.target.value,
    this.setState({
      newSiteValue: event.target.value.toUpperCase()
    });

    if (event.target.value != "") {
      this.state.enableSaveButton = true;
    }
    //  onChange={e => this.setState({ siteEditDlg: e.target.value.toUpperCase() })}
  }
  setSiteNew(value) {
    console.log("setSiteNew setSiteNew setSiteNew: " + value);
    this.setState({
      newSiteValue: value
    });
    if (value != "") {
      this.state.enableSaveButton = true;
    }
    // this.setIdANDDescForAddDialog(this.state.newSite, event.target.value, this.state.siteData)
  }
  setLateralNew(event) {
    this.setState({
      newLateralListValue: event.target.value
    });
    this.setIdANDcodeForAddDialog(
      this.state.newLateral,
      event.target.value,
      this.state.latralcodeData
    );
  }
  setHistologyNew(event) {
    this.setState({
      newHistocodesValue: event.target.value
    });
    this.setIdANDDescForAddDialog(
      this.state.newHisto,
      event.target.value,
      this.state.histocodesData
    );
  }
  setbehaviourcodesNew(event) {
    this.setState({
      newBehaviourcodesValue: event.target.value
    });
    this.setIdANDcodeForAddDialog(
      this.state.newBehavior,
      event.target.value,
      this.state.behaviourcodesData
    );
  }
  setDiagSourceNew(event) {
    this.setState({
      newDiagSourceValue: event.target.value
    });
    this.setIdANDcodeForAddDialog(
      this.state.newSource,
      event.target.value,
      this.state.diagSourceData
    );
  }
  setTissueNew(event) {
    this.setState({
      newTissueValue: event.target.value
    });
    this.setIdANDcodeForAddDialog(
      this.state.newTissue,
      event.target.value,
      this.state.tissueData
    );
  }

  /**END --  Add Cancer Dialog - Handle functions */

  createNewCancerArray() {
    this.state.isCanecerAdded = true;
    this.state.newCancerModalId = Math.floor(Math.random() * 10);

    // var newCancerObject = new Object;
    this.state.newCancerObject.patientPersonID = this.state.patientDataObject.personID;
    // this.state.newCancerArr[i] = cloneDeep(this.state.cancerInfo[i]);
    // this.state.newCancerObject.id=3334;
    this.state.newCancerObject.tumorNo = Math.floor(Math.random() * 10);
    // this.state.newCancerObject.ageDiagnosis = 99;
    this.state.newCancerObject.site = this.state.newSite;

    // this.state.newCancerObject.tumorNo =44;
    this.state.newCancerObject.lateral = this.state.newLateral;
    // Remove comment
    // this.state.newCancerObject.histology = this.state.newHisto;
    this.state.newCancerObject.behaviour = this.state.newBehavior;
    // console.log("this.state.newCancerObject.behaviour " + this.state.newCancerObject.behaviour.description)
    // console.log("this.state.newCancerObject.behaviour " + this.state.newCancerObject.behaviour.code)
    this.state.newCancerObject.diagSource = this.state.newSource;
    this.state.newCancerObject.tissue = this.state.newTissue;
    this.state.newCancerObject.dateOfDiagnosis = "20180101";
    this.state.newCancerObject.ageDiagnosis = "88";

    // this.state.newCancerArr[this.state.newCancerObject.tumorNo] =this.state.newCancerObject ;
    this.state.newCancerArr.push(this.state.newCancerObject);

    this.state.cancerInfo.push(this.state.newCancerObject);
  }

  setSiteOnChange(event) {
    // console.log("Site :" + value);
    console.log("Site :" + event.target.value);
    // siteEditDlg: event.target.value,
    this.setState({
      siteEditDlg: event.target.value.toUpperCase()
    });

    if (event.target.value != "") {
      this.state.enableSaveButton = true;
    }
    //  onChange={e => this.setState({ siteEditDlg: e.target.value.toUpperCase() })}
  }

  setSite(value) {
    console.log("Site :" + value);
    // console.log("Site :" + event.target.value);
    // siteEditDlg: event.target.value,
    this.setState({
      siteEditDlg: value
    });

    if (value != "") {
      this.state.enableSaveButton = true;
    }
    // this.enableSaveInEditDialog("siteEditDlg", event);
  }
  setLateral(event) {
    this.setState({
      lateralFromDb: event.target.value
    });

    this.enableSaveInEditDialog("lateralFromDb", event);
  }
  setHistology(event) {
    this.setState({
      histocodesFromDb: event.target.value
    });

    this.enableSaveInEditDialog("histocodesFromDb", event);
  }
  setbehaviourcodes(event) {
    this.setState({
      behaviourcodesFromDb: event.target.value
    });

    this.enableSaveInEditDialog("behaviourcodesFromDb", event);
  }

  setDateOfDiag() {
    console.log("called setDateOfDiag ");
  }
  /* Diagnostic Date values START*/
  handleMonthPickedDiag = selectedEditMonth => {
    console.log("Month Picked : " + selectedEditMonth);
    this.setState({
      selectedEditMonth: selectedEditMonth != "Month" ? selectedEditMonth : ""
    }, () => {
      this.calculateAgeOfDiag();
    });
  };
  handleYearPickedDiag = (selectedEditYear, e) => {
    console.log("handleYearPicked : " + selectedEditYear);
    this.setState({
      selectedEditYear: selectedEditYear != "Year" ? selectedEditYear : ""
      // }, () => {
      //   this.calculateAgeOfDiag();
    });
    this.setState(
      {
        ageDiagnosisFromDb: this.state.ageDiagnosisFromDb
      },
      () => {
        this.calculateAgeOfDiag();
      }
    );
    // this.calculateAgeOfDiag();

    // if(handleYearPickedDiag!=''    handleMonthPickedDiag!=''    handleDatePickedDiag!='')
    // this.state.ageDiagnosisFromDb = 22
  };

  handleDatePickedDiag = selectedEditDate => {
    console.log("Date    Picked : " + selectedEditDate);
    this.setState({
      selectedEditDate: selectedEditDate != "Day" ? selectedEditDate : ""
    }, () => {
      this.calculateAgeOfDiag();
    });

    // this.calculateAgeOfDiag();
  };

  calculateAgeOfDiag = () => {
    console.log("In calculateAgeOfDiag: " + dob);

    if (
      this.state.selectedEditYear != "" &&
      this.state.selectedEditMonth != "" &&
      this.state.selectedEditDate != ""
    ) {
      var dob = this.convertToGetDate(this.state.selectedPersonData.dateOfBirth);
      // var currentDeathDate = this.convertToGetDate(this.state.selectedPersonData.dateOfDeath);
      //  new Date(        this.convertDateFormat(this.state.selectedPersonData.dateOfBirth)      );

      this.setState({
        dateOfDiagFromDb: this.state.selectedEditYear + this.state.selectedEditMonth + this.state.selectedEditDate
      });
      // var dodiag = new Date(this.convertDateFormat(this.state.dateOfDiagFromDb));
      var dodiag = this.getDate(this.state.selectedEditDate, this.state.selectedEditMonth, this.state.selectedEditYear);

      // 
      console.log("In didupdate NOT NULL dob : " + dob);
      console.log("In didupdate NOT NULL DIAG DATE : " + dodiag);

      // var dt1 = Math.floor((dodiag - dob) / 31536000000);
      var dt1 = this.getAge(dob, dodiag)

      console.log("In didupdate NOT NULL DIAG DATE : " + dt1);
      // this.state.ageDiagnosisFromDb = dt1


      this.setState({
        ageDiagnosisFromDb: dt1
        // }, () => {
        //   this.getAge(dob, dodiag);
      });

      this.state.enableSaveButton = true;
    }
  }
  getAge = (birthDateLocal, dateOfDiagLocal) => {


    var curYear = birthDateLocal.getFullYear();
    var dobYear = dateOfDiagLocal.getFullYear();
    var age = dobYear - curYear;

    var curMonth = birthDateLocal.getMonth();
    var dobMonth = dateOfDiagLocal.getMonth();
    if (dobMonth > curMonth) {
      // this year can't be counted!
      age;
    } else if (dobMonth == curMonth) {
      // same month? check for day

      var curDay = birthDateLocal.getDate();
      var dobDay = dateOfDiagLocal.getDate();
      if (dobDay > curDay) {
        // this year can't be counted!
        age;
      }
    }

    return age;
  }
  /* Diagnostic Date values END*/

  setDiagSource(event) {
    this.setState({
      diagSourceFromDb: event.target.value
    });

    this.enableSaveInEditDialog("diagSourceFromDb", event);
  }
  setTissue(event) {
    this.setState({
      tissueFromDb: event.target.value
    });

    this.enableSaveInEditDialog("diagSourceFromDb", event);
  }
  enableSaveInEditDialog(fieldName, event) {
    if (fieldName != event.target.value) {
      this.state.enableSaveButton = true;
    } else {
      this.state.enableSaveButton = false;
    }
  }
  setCurrentAge(event) {
    // event.preventDefault(); ageDiagnosisFromDb
    console.log(" column Name : " + event.target.value);
    this.setState({
      ageDiagnosisFromDb: event.target.value
    });

    this.enableSaveInEditDialog("ageDiagnosisFromDb", event);
  }
  closeDialog() {
    console.log(
      "CloseDialog Only when Add Cancer save----------------------------" +
      this.props.values.ageOfDigColumn
    );

    this.state.showAddCancer = false;
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
  componentDidUpdate(prevProps) {
    console.log("In didupdate");

    const { success: wasSuccess = false } = prevProps.status || {};
    const { success: isSuccess = false } = this.props.status || {};

    // console.log("dateOfDiagFromDb componentWillMount: " + this.state.dateOfDiagFromDb)
    // if (this.state.dateOfDiagFromDb != '') {
    //   this.setState({
    //     dodExist: true,

    //   });
    //   this.state.ageDiagnosisFromDb = new Date(this.state.dateOfDiagFromDb) - new Date(this.state.selectedPersonData.dateOfBirth);
    //   // this.setState.dodExist = true;
    //   console.log("dateOfDiagFromDb : " + this.state.dateOfDiagFromDb)
    //   console.log("ageDiagnosisFromDb : " + this.state.ageDiagnosisFromDb)
    //   console.log("selectedPersonData.dateOfBirth : " + this.state.selectedPersonData.dateOfBirth)

    // }

    if (isSuccess) {
      console.log("In didupdate IF");
      // this.state.showAddCancer=false;

      this.closeDialog();
      // this.htmlForm.submit();
    }
  }
  render() {
    const modelSizeStyle = { width: "800px", height: "800px" };
    let validation = this.submitted // if the form has been submitted at least once
      ? this.validator.validate(this.state) // then check validity every time we render
      : this.state.validation; // otherwise just use what's in state

    const { values, errors, touched, isSubmitting } = this.props;
    let rows = this.state.cancerInfo.map((cancer, i) => {
      // console.log("in render"+ person.id)
      // console.log("in render i :"+ i)
      return (
        <PersonRow
          key={cancer.id}
          rowId={i}
          cancerInfo={cancer}
          handleShow={this.handleShow}
        />
      );
    });

    return (
      <div>
        <HeaderPanel patientDetials={this.state.patientData} />
        Cancer Information
        <table className="TFtable">
          <tbody>
            <tr>
              <th>TUMOR_NO</th>
              <th>SITE</th>
              <th>LATERAL</th>
              <th>HISTOLOGY</th>
              <th>BEHAVIOR</th>
              <th>DIAGNOSIS DATE</th>
              <th>AGE DIAGNOSIS</th>
              <th>DIAGNOSIS SOURCE:</th>
              <th>TISSUE</th>
              <th>UPDATE</th>
            </tr>

            {rows}
          </tbody>
        </table>
        <Button className="btn btn-cancer" onClick={this.handleShowAddCancer}>
          {" "}
          Add Cancer
        </Button>
        <p>
          “If you wish to delete any of these cancers please contact CFR
          Informatics.”{" "}
        </p>
        {/* Modal for Editing New Cancer - START*/}
        <div>
          <Modal
            backdrop={false}
            show={this.state.show}
            onHide={this.handleClose}
            keyboard={false}
            selectedid={this.state.selectedId}
          >
            <Modal.Header closeButton={false}>
              <Modal.Title>
                <div className="modalHeader">Cancer Edit</div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* value= {}this.state.data[].name */}
              {/* Condition for the value is needed to render the element at the the initial load */}
              {/* <input type="text" onChange={this.handleTxtChange}  value = {this.state.selectedId=='' ? this.state.cancerInfo[0].age : this.state.cancerInfo[this.state.selectedId].age}/> */}

              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Site:</div>
                <div className="col-sm-5 control-margin">
                  {/* <Autocomplete
                    wrapperStyle={{ width: "100%" }}
                    inputProps={{
                      style: {
                        width: "100%",
                        height: "42px",
                        border: "1px solid #e6e6e6",
                        padding: "0 35px 0 19px",
                        color: "#999",
                        bordeRadius: "4px"
                      },
                      placeholder: "Enter Family ID"
                    }}
                    wrapperStyle={{ width: "100%" }}
                    className="form-control-modal"
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
                    value={this.state.siteEditDlg}
                    //   onChange={this.setFamilyValue.bind(this)}
                    // onChange={e => this.setState({ value: e.target.value })}
                    onChange={this.setSiteOnChange.bind(this)}
                    // onChange={e => this.setState({ siteEditDlg: e.target.value.toUpperCase() })}setSiteOnChange
                    onSelect={this.setSite.bind(this)}
                    //   onSelect={value => this.setState({ value })}
                    //   on
                  /> */}
                  {/* disabled={this.state.isAlive} */}
                  <select
                    /**disabled={this.state.isAlive}**/ className="form-control dorp-box"
                    defaultValue={this.state.siteEditDlg}
                    onChange={this.setSiteOnChange.bind(this)}
                    name="currentDeathColumn"
                  >
                    {this.state.siteData.map((siteGroup, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.siteGroup = siteGroup.description;
                      return (
                        <option
                          key={siteGroup.value}
                          defaultValue={this.state.siteEditDlg}
                        >
                          {siteGroup.code}
                          {/* + " || " + siteGroup.description */}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Lateral:</div>
                <div className="col-sm-5 control-margin">
                  <select
                    /**disabled={this.state.isAlive}**/ className="form-control-modal"
                    value={this.state.lateralFromDb}
                    onChange={this.setLateral.bind(this)}
                    name="currentDeathColumn"
                  >
                    {this.state.latralcodeData.map((lateralList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.lateralList = lateralList.description;
                      return (
                        <option
                          key={lateralList.value}
                          defaultValue={this.state.lateralFromDb}
                        >
                          {lateralList.description}
                        </option>
                      );
                    })
                      // <option >{"Hospital Rec"}</option>
                    }
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Histology:</div>
                <div className="col-sm-5 control-margin">
                  <select
                    /**disabled={this.state.isAlive}**/ className="form-control-modal"
                    value={this.state.histocodesFromDb}
                    onChange={this.setHistology.bind(this)}
                    name="currentDeathColumn"
                  >
                    {this.state.histocodesData.map((histocodesList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.histocodesList = histocodesList.description;
                      return (
                        <option
                          key={histocodesList.value}
                          defaultValue={this.state.histocodesFromDb}
                        >
                          {
                            histocodesList.code /*+" | "+histocodesList.description*/
                          }
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Behaviour:</div>
                <div className="col-sm-5 control-margin">
                  <select
                    /**disabled={this.state.isAlive}**/ className="form-control-modal"
                    value={this.state.behaviourcodesFromDb}
                    onChange={this.setbehaviourcodes.bind(this)}
                    name="currentDeathColumn"
                  >
                    {this.state.behaviourcodesData.map(
                      (behaviourcodesList, i) => {
                        // console.log("location ID :  " + siteGroup.id);

                        this.state.behaviourcodesList =
                          behaviourcodesList.description;
                        return (
                          <option
                            key={behaviourcodesList.value}
                            defaultValue={this.state.behaviourcodesFromDb}
                          >
                            {behaviourcodesList.description}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">
                  Date Of Diagnosis:
                </div>
                <div className="col-sm-5 control-margin">
                  <DateSelect
                    onPropertyChange={this.setDateOfDiag}
                    isAlive={false}
                    dateOfDiagFromDb={this.state.dateOfDiagFromDb}
                    value={this.state.currentDOB}
                    name="diagDateColumn"
                    onSelectYear={this.handleYearPickedDiag}
                    onSelectMonth={this.handleMonthPickedDiag}
                    onSelectDate={this.handleDatePickedDiag}
                    name="dateOfDiagFromDb"
                  />

                  {/* <DatePicker
                                                    onChange={this.oncurrentDOBChange}
                                                    value={this.state.currentDOB}
                                                /> */}
                  <div className="validationMsg">
                    {/* <Error name="currentdobColumn" /> */}
                  </div>
                  <span className="help-block">
                    {validation.dateOfDiagFromDb.message}
                  </span>

                  {/* <DatePicker
                    // onChange={this.oncurrentDOBChange}
                    value={this.state.currentDOB}
                  /> */}
                </div>
              </div>
              {/* "{validation.ageDiagnosisFromDb.isInvalid && 'has-error'}"  */}
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Age Of Diagnosis:</div>
                {/* console.log("dod EXIST" + this.state.dodExist) */}
                {/* {this.setState.dateOfDiagFromDb != '' ? this.state.dodExist = true : this.state.dodExist = false} */}
                <div
                  className="col-sm-4 control-margin"
                  disabled={console.log(
                    "dod EXIST" + this.state.dateOfDiagFromDb
                  )}
                >
                  <input
                    className="form-control-modal"
                    disabled={this.state.dateOfDiagFromDb != "" ? true : false}
                    false="text"
                    placeholder="age"
                    value={this.state.ageDiagnosisFromDb}
                    onChange={this.setCurrentAge.bind(this)}
                    name="ageDiagnosisFromDb"
                  />
                </div>

                <span className="help-block">
                  {validation.ageDiagnosisFromDb.message}
                </span>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Source:</div>
                <div className="col-sm-5 control-margin">
                  <select
                    disabled={this.state.isAlive}
                    className="form-control-modal"
                    value={this.state.diagSourceFromDb}
                    onChange={this.setDiagSource.bind(this)}
                    name="currentDeathColumn"
                  >
                    {this.state.diagSourceData.map((diagSourceList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.diagSourceList = diagSourceList.description;
                      return (
                        <option
                          key={diagSourceList.value}
                          defaultValue={this.state.diagSourceFromDb}
                        >
                          {diagSourceList.description}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 control-margin">Tissue:</div>
                <div className="col-sm-5 control-margin">
                  <select
                    disabled={this.state.isAlive}
                    className="form-control-modal"
                    value={this.state.tissueFromDb}
                    onChange={this.setTissue.bind(this)}
                    name="currentDeathColumn"
                  >
                    {this.state.tissueData.map((tissueList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.tissueList = tissueList.description;
                      return (
                        <option
                          key={tissueList.value}
                          defaultValue={this.state.tissueFromDb}
                        >
                          {tissueList.description}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <br />
                <br />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="btn btn-primary" onClick={this.handleClose}>
                Close
              </Button>
              <Button
                className="btn btn-primary"
                disabled={!this.state.enableSaveButton}
                onClick={this.handleSaveEditCancer}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        {/* Modal for Editing New Cancer - END*/}
        {/* Modal for Adding New Cancer - START*/}
        <Modal
          backdrop={false}
          show={this.state.showAddCancer}
          onHide={this.handleCloseAddCancer}
          keyboard={false}
          selectedid={this.state.selectedId}
        >
          {/* onSubmit={this.props.handleSubmit} */}
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
                    value={this.state.newSiteValue}
                    onChange={this.setSiteNew.bind(this)}
                    name="currentDeathColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.siteData.map((siteGroup, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.siteGroup = siteGroup.description;
                      return (
                        <option
                          key={siteGroup.value}
                          defaultValue={siteGroup.id}
                        >
                          {siteGroup.code /*+" | "+siteGroup.description*/}
                        </option>
                      );
                    })}
                  </select>
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
                    value={this.state.newLateralListValue}
                    onChange={this.setLateralNew.bind(this)}
                    name="newLateralColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.latralcodeData.map((lateralList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.lateralList = lateralList.description;
                      return (
                        <option
                          key={lateralList.value}
                          defaultValue={lateralList.id}
                        >
                          {lateralList.description}
                        </option>
                      );
                    })
                      // <option >{"Hospital Rec"}</option>
                    }
                    }
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Histology:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    disabled={this.state.isAlive}
                    className="form-control-modal"
                    value={this.state.newHistocodesValue}
                    onChange={this.setHistologyNew.bind(this)}
                    name="newHistoColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.histocodesData.map((histocodesList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.histocodesList = histocodesList.description;
                      return (
                        <option
                          key={histocodesList.value}
                          defaultValue={histocodesList.id}
                        >
                          {
                            histocodesList.code /*+" | "+histocodesList.description*/
                          }
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Behaviour:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    disabled={this.state.isAlive}
                    className="form-control-modal"
                    value={this.state.newBehaviourcodesValue}
                    onChange={this.setbehaviourcodesNew.bind(this)}
                    name="newBehaviorColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.behaviourcodesData.map(
                      (behaviourcodesList, i) => {
                        // console.log("location ID :  " + siteGroup.id);

                        this.state.behaviourcodesList =
                          behaviourcodesList.description;
                        return (
                          <option
                            key={behaviourcodesList.value}
                            defaultValue={behaviourcodesList.id}
                          >
                            {behaviourcodesList.description}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required">
                  Date Of Diagnosis:
                </div>
                <div className="col-sm-4">
                  <DateSelect
                    isAlive={false}
                    dateOfDiagFromDb={this.state.dateOfDiagFromDb}
                    value={this.state.currentDOB}
                    name="diagDateNewColumn"
                    onSelectYear={this.handleYearPickedDiag}
                    onSelectMonth={this.handleMonthPickedDiag}
                    onSelectDate={this.handleDatePickedDiag}
                  />

                  {/* <DatePicker
                    // onChange={this.oncurrentDOBChange}
                    value={this.state.currentDOB}
                  /> */}
                </div>
              </div>
              <div className="row form-check form-check-inline ">
                <div className="col-sm-5 asteric-required control-margin">
                  Age Of Diagnosis:
                </div>
                <div className="col-sm-4 control-margin">
                  <Field
                    classNAme="form-control-modal"
                    type="text"
                    placeholder="age"
                    name="ageDiagnosisFromDb"
                  />
                  <div className="inline-error">
                    {touched.ageDiagnosisFromDb &&
                      errors.ageDiagnosisFromDb && (
                        <p>{errors.ageDiagnosisFromDb}</p>
                      )}
                  </div>
                </div>
              </div>

              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Source:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    disabled={this.state.isAlive}
                    className="form-control-modal "
                    value={this.state.newDiagSourceValue}
                    onChange={this.setDiagSourceNew.bind(this)}
                    name="newSourceColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.diagSourceData.map((diagSourceList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.diagSourceList = diagSourceList.description;
                      return (
                        <option
                          key={diagSourceList.value}
                          defaultValue={diagSourceList.id}
                        >
                          {diagSourceList.description}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="row form-check form-check-inline">
                <div className="col-sm-5 asteric-required control-margin">
                  Tissue:
                </div>
                <div className="col-sm-5 control-margin">
                  <select
                    disabled={this.state.isAlive}
                    className="form-control-modal"
                    value={this.state.newTissueValue}
                    onChange={this.setTissueNew.bind(this)}
                    name="currentDeathColumn"
                  >
                    <option>{"Choose One"}</option>
                    {this.state.tissueData.map((tissueList, i) => {
                      // console.log("location ID :  " + siteGroup.id);

                      this.state.tissueList = tissueList.description;
                      return (
                        <option
                          key={tissueList.value}
                          defaultValue={tissueList.id}
                        >
                          {tissueList.description}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {/* <hr /> */}
            </Modal.Body>
            <Modal.Footer>
              {/* <button type="submit">submit</button>
                    <button type="submit" onClick={this.handleCloseAddCancer} >Close</button> */}

              <button
                className="btn btn-primary"
                type="button"
                onClick={this.handleCloseAddCancer}
              >
                Close
              </button>
              {/* <Button onClick={this.handleCloseAddCancer} >Close</Button> */}
              {/* <button  disabled={isSubmitting}>Save</button> */}
              {/* <button  type= "submit" disabled={isSubmitting}>Save</button> */}
              {/* <Button disabled= {!this.state.enableSaveButton} onClick={this.handleSave}>Save</Button> */}

              <Button
                className="btn btn-primary"
                onClick={this.handleSaveAddCancer}
              >
                Save
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* Modal for Adding New Cancer END*/}
      </div>
    );
  }
}

const PersonRow = props => {
  return (
    <tr>
      <td>{props.cancerInfo.tumorNo}</td>

      <td>{props.cancerInfo.site.description}</td>
      <td>{props.cancerInfo.lateral.description}</td>
      <td>
        {/*   // Remove comment */}
        {/* { props.cancerInfo.histology.code } */}
      </td>
      <td>{props.cancerInfo.behaviour.description}</td>
      <td>
        {props.cancerInfo.dateOfDiagnosis != null
          ? props.cancerInfo.dateOfDiagnosis.slice(4, 6) +
          "/" +
          props.cancerInfo.dateOfDiagnosis.slice(6, 8) +
          "/" +
          props.cancerInfo.dateOfDiagnosis.slice(0, 4)
          : "N/A"}
      </td>
      <td>{props.cancerInfo.ageDiagnosis}</td>
      <td>{props.cancerInfo.diagSource.description}</td>

      <td>
        {props.cancerInfo.tissue != null
          ? props.cancerInfo.tissue.description
          : null}
      </td>
      {/*<td>
          { props.cancerInfo.issuetype }
        </td> */}
      <td>
        <Button bsSize="small" onClick={() => props.handleShow(props.rowId)}>
          Edit
        </Button>
      </td>
    </tr>
  );
};
const DialogFormikApp = withFormik({
  mapPropsToValues({ ageOfDigColumn, show }) {
    return {
      // email: email || '',
      // aodeathColumn:'fromDb',
      // currentaodeathColumn: "testin",
      ageOfDigColumn: "",
      show: false
      // vitalStatusColumn: 1,
    };
  },

  validationSchema: Yup.object().shape({
    // email: Yup.string().email('Email not valid').required('Email is required'),
    ageOfDigColumn: Yup.string().required("value is required")
    // password: Yup.string().min(9, 'Password must be 9 characters or longer').required('Password is required')
  }),

  // The value for variable "show=false" is passed to the method componentDidUpdate() and used in closing the dialog.
  handleSubmit(
    values,
    { resetForm, setErrors, setSubmitting, setStatus, onOpenDialog }
  ) {
    console.log("SUBMIT" + values.show);
    // this.setState({show: false}) ;
    if (values.show == false) {
      setStatus({ success: true });
    } else {
      setStatus({ success: false });
    }

    // setStatus({showAddCancer:false});
    // resetForm()
    //Sending value to parent
    // onOpenDialog(true);
    setTimeout(() => {
      if (values.email === "andrew@test.io") {
        setErrors({ email: "That email is already taken" });
      } else {
        resetForm();
      }
      setSubmitting(false);
    }, 100);
  }
})(CancerInfo);

export default DialogFormikApp;

// TODo
// {/* <Form /* onSubmit={this.handleSubmit} */>
