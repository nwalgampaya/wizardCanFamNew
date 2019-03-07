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
import AddCancer from "../AddCancer";
import EditCancer from "../EditCancer";

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
      showAddCancerDialog: false,
      showEditCancerDialog: false,
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
      cancerInfoEdited: [{}],
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
      cancer: null,
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
      var date = formatDatestr.slice(6, 8);

      formatDatestr = year + "," + month + "," + date;
    } else formatDatestr = "N/A";
    console.log("formatDatestr : " + formatDatestr);

    formatDatestr = this.getDate(date, month, year);
    return formatDatestr;
  }

  getDate(d, m, y) {
    console.log("getDate Month : " + m);
    var currentDate;
    if (d == "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m), 15);
      // currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));

      console.log("if---1 : " + currentDate);
    } else if (d != "99" && m == "99" && y != "9999") {
      currentDate = new Date(parseInt(y), 7, parseInt(d));
      console.log("if---2 : " + currentDate);
    } else if (d == "99" && m == "99" && y != "9999") {
      currentDate = new Date(parseInt(y), 7, 1);
      console.log("if---3 : " + currentDate);
    } else if (d != "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      console.log("if---4 : " + currentDate);
    }
    return currentDate;
  }

  validateDiagnosisDate = () => {
    // var currentDeathDate = this.getDate(d, m, y);
    var currentDeathDate = this.convertToGetDate(
      this.state.selectedPersonData.dateOfDeath
    );

    // if (this.state.isValidLKDSelected) {
    var currentLKDDate = this.getDate(
      this.state.selectedEditDate,
      this.state.selectedEditMonth,
      this.state.selectedEditYear
    );

    if (
      typeof currentLKDDate !== "undefined" &&
      typeof currentDeathDate !== "undefined"
    ) {
      if (currentDeathDate > currentLKDDate) {
        console.log("In validateDiagnosisDate() ");
        return true;
        // errors.currentdodColumn =
        //   "Death date should be greater than LKD date";
      } else return false;
    }
  };
  negativeAge = () => {
    console.log("In Negative : " + this.state.ageDiagnosisFromDb);
    console.log("In Negative : " + this.state.selectedPersonData.dateOfDeath);
    console.log("In Negative : " + this.state.dateOfDiagFromDb);

    var locaDoDeath = this.convertToGetDate(
      this.state.selectedPersonData.dateOfDeath
    );
    // new Date(this.convertDateFormat(this.state.selectedPersonData.dateOfDeath));
    var locaDoDiag = this.convertToGetDate(this.state.dateOfDiagFromDb);
    // new Date(this.convertDateFormat(this.state.dateOfDiagFromDb));
    console.log("locaDoDeath : " + locaDoDeath);
    console.log("locaDoDiag : " + locaDoDiag);
    console.log(
      "In Negative difference: " +
      Math.floor((locaDoDeath - locaDoDiag) / 31536000000)
    );

    console.log(
      "In Negative :  dateOfDeath: " +
      new Date(
        this.convertDateFormat(this.state.selectedPersonData.dateOfDeath)
      )
    );

    console.log(
      "In Negative : dateOfDiagFromDb  : " +
      new Date(this.convertDateFormat(this.state.dateOfDiagFromDb))
    );

    // Math.floor((dodiag - dob) / 31536000000);
    if (Math.floor((locaDoDeath - locaDoDiag) / 31536000000) > 0) {
      console.log("dateOfDeath is greater TRUE");
      return true;
    } else {
      console.log("dateOfDeath is greater FALSE");
      return false;
    }
    if (this.state.ageDiagnosisFromDb < 0) {
      console.log("dateOfDeath is greater");
      return true;
    } else {
      console.log("dateOfDeath is lesser");

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
  recordEditedData(editedCancer) {
    //this.state.cancerInfoEdited.push(cancer);
    // this.state.cancerInfoEdited[this.state.tumorNo] = [
    //   ...this.state.cancerInfo[this.state.tumorNo]
    // ];

    this.state.isNewCancer = false;

    this.state.newCancerArr.map((values, i) => {
      console.log("tumor_no : " + values.tumorNo);
      if (values.tumorNo == this.state.cancerInfo[this.state.tumorNo].tumorNo) {
        this.state.isNewCancer = true;
      }
    });

    this.setState({ isNewCancer: this.state.isNewCancer });

    this.createEditedArray(editedCancer);
    // Conditioning only to display edited cancers in preview , to avoid New cancer displayed as edited
    if (!this.state.isNewCancer) {
      this.getChangedFieldsOnly(editedCancer);
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
  createEditedArray(editedCancer) {
    var cancerEdited = new Object();

    let cancerBeforeEdited = this.state.cancerInfoCopy.find(
      cancer => cancer.tumorNo == editedCancer.tumorNo
    );
    cancerEdited.tumorNo = editedCancer.tumorNo;

    if (cancerBeforeEdited.site.code != editedCancer.site.code) {
      cancerEdited.site = editedCancer.site.code;
    }
    if (cancerBeforeEdited.lateral.code != editedCancer.lateral.code) {
      console.log("lateral changed ***********" + this.state.lateralFromDb);
      cancerEdited.lateral = editedCancer.lateral.description;
    }

    if (cancerBeforeEdited.histology != editedCancer.histology) {
      cancerEdited.histology = editedCancer.histology;
    }
    if (cancerBeforeEdited.behaviour.code != editedCancer.behaviour.code) {
      cancerEdited.behaviour = editedCancer.behaviour.description;
    }

    if (cancerBeforeEdited.diagSource.id != editedCancer.diagSource.id) {
      cancerEdited.diagSource = editedCancer.diagSource.description;
    }
    if (cancerBeforeEdited.tissue.code != editedCancer.tissue.code) {
      cancerEdited.tissue = editedCancer.tissue.description;
    }

    if (cancerBeforeEdited.dateOfDiagnosis != editedCancer.dateOfDiagnosis) {
      cancerEdited.dateOfDiagnosis = editedCancer.dateOfDiagnosis;
    }
    if (cancerBeforeEdited.ageDiagnosis != editedCancer.ageDiagnosis) {
      cancerEdited.ageDiagnosis = editedCancer.ageDiagnosis;
    }
    this.state.cancerInfoEdited.push(cancerEdited);
  }

  getChangedFieldsOnly(cancerEditedParam) {
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
    this.state.isCancerEdited = true;
    let cancerOriginal = this.state.cancerInfoCopy.find(
      cancerOrg => cancerOrg.tumorNo == cancerEditedParam.tumorNo
    );
    let cancerEdited = this.state.cancerInfoEdited.find(
      cancerOrg => cancerOrg.tumorNo == cancerEditedParam.tumorNo
    );

    var EditedParam = new Array();
    for (var param in cancerEdited) {
      var changeCol = new Object();
      // console.log(param + ':: ' + this.state.cancerInfo[this.state.tumorNo][param]);
      // console.log(param + ':: ' + this.state.cancerInfoEdited[this.state.tumorNo][param]);
      changeCol.column = param; //add Tumor No
      changeCol.previousVal = cancerOriginal[param];
      changeCol.newVal = cancerEdited[param];

      if (param == "site") {
        changeCol.column = "Site";
        changeCol.previousVal = changeCol.previousVal.code;
        console.log("--------------------------------" + changeCol.previousVal);
      }
      if (param == "lateral") {
        changeCol.column = "Lateral";
        changeCol.previousVal = changeCol.previousVal.description;
      }
      if (param == "histology") {
        changeCol.column = "Histology";
        changeCol.previousVal = changeCol.previousVal;
      }
      if (param == "behaviour") {
        changeCol.column = "Behaviour";
        console.log("--------------------------------" + changeCol.previousVal);
        changeCol.previousVal = changeCol.previousVal.description;
      }
      if (param == "dateOfDiagnosis") {
        changeCol.column = "Date Of Diagnosis";
        console.log("--------------------------------" + changeCol.previousVal);
        changeCol.previousVal = changeCol.previousVal;
      }
      if (param == "ageDiagnosis") {
        changeCol.column = "Age Of Diagnosis";
        console.log("--------------------------------" + changeCol.previousVal);
        changeCol.previousVal = changeCol.previousVal;
      }
      if (param == "diagSource") {
        changeCol.column = "Source";
        console.log("--------------------------------" + changeCol.previousVal);
        changeCol.previousVal = changeCol.previousVal.description;
      }
      if (param == "tissue") {
        changeCol.column = "Tissue";
        console.log("--------------------------------" + changeCol.previousVal);
        changeCol.previousVal = changeCol.previousVal.description;
      }

      console.log("PARAM edited" + param);
      EditedParam[this.state.editedRecordCount] = changeCol;
      this.state.editedRecordCount++;
    }

    const index = this.state.arrayEditedData.findIndex(EditedParam => {
      return EditedParam.some(item => {
        //^^if (^^^^
        if (item.column == "tumorNo")
          return item.previousVal === cancerEditedParam.tumorNo;
      });
    });

    if (index != -1) {
      this.state.arrayEditedData[index] = EditedParam;
    } else {
      this.state.arrayEditedData.push(EditedParam);
    }
    // const index = this.state.arrayEditedData.findIndex(
    //   e => e.tumorNo == cancer.tumorNo
    // );
    //

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
    //this.state.patientDataObject.cancerList = this.state.cancerInfo;

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
    this.state.showAddCancerDialog = true;
    this.setState({ showAddCancerDialog: true });
    // this.state.selectedId=id
    console.log("in handleShow selectedId ;" + this.state.selectedId);
  }
  handleShowEditCancer = (tumorNo, rowId) => {
    console.log("in handleShow" + tumorNo);
    // console.log("handleYearPicked : " + e.target.valu)
    this.state.selectedId = rowId;
    this.state.tumorNo = rowId;
    this.setState({
      cancer: this.state.cancerInfo.find(x => x.tumorNo == tumorNo),
      showEditCancerDialog: true
    });
    this.loadDataToEditDialog(rowId);
    // this.setState(
    //   { showEditCancerDialog: true },

    //   () => this.showEditCancer(tumorNo)
    // );
  };

  showEditCancer(tumorNo) {
    // return (
    //   <EditCancer
    //     cancer={cancer}
    //     patientData={this.state.patientData}
    //     showEditCancerDialog={this.state.showEditCancerDialog}
    //     onSaveCancer={this.refresEditedhCancerList.bind(this)}
    //   />
    // );
  }
  handleTxtChange(e) {
    //alert("txt" + e.target.value)
    // this.state.textValue= e.target.value;
    this.setState({ textValue: e.target.value });
  }

  // Edit Modal Dialog functions
  handleShow = tumorNo => {
    console.log("in handleShow" + tumorNo);
    // console.log("handleYearPicked : " + e.target.valu)

    this.setState(
      { showEditCancerDialog: true },

      () => this.showEditCancer(tumorNo)
    );
  };

  showEditCancer(tumorNo) {
    var cancer = this.state.cancerInfo.find(x => x.tumorNo === tumorNo);

    // return (
    //   <EditCancer
    //     cancer={cancer}
    //     patientData={this.state.patientData}
    //     showEditCancerDialog={this.state.showEditCancerDialog}
    //     onSaveCancer={this.refresEditedhCancerList.bind(this)}
    //   />
    // );
  }

  //   // this.setState({ showAddCancer: true });
  //   this.state.selectedId = id;
  //   // this will be the unique id of the selected record.ta
  //   this.state.tumorNo = id;
  //   console.log("in handleShow selectedId ;" + this.state.selectedId);

  //   this.loadDataToEditDialog(id);
  // }

  refreshCancerList(cancerAdded) {
    this.state.isCanecerAdded = true;
    this.state.newCancerArr.push(cancerAdded);
    this.state.cancerInfo.push(cancerAdded);

    this.state.newCancerArr.map((values, i) =>
      console.log("site values :" + values.site.id)
    );
    // Sending the modified patient with added cancer object to be saved to main page(cancerFamily)
    this.state.patientDataObject.cancerList = this.state.cancerInfo;

    this.props.onSaveNewInfo(
      this.state.newCancerArr,
      this.state.patientDataObject,
      this.state.isCanecerAdded
    );

    // this.state.patientDataObject = patient;
    // this.state.cancerInfo = patient.cancerList;
    // this.setState({
    //   patientDataObject: patient,
    //   cancerInfo: patient.cancerList,
    //   showAddCancerDialog: false
    // });
    // this.createNewCancerArray();
    // this.sendNewCancerToPreview();
  }

  refresEditedhCancerList(cancer) {
    const index = this.state.patientDataObject.cancerList.findIndex(
      e => e.tumorNo == cancer.tumorNo
    );
    this.state.patientDataObject.cancerList[index] = cancer;
    var cancerlist = this.state.cancerInfo;
    cancerlist[index] = cancer;

    Object.assign(this.state.patientDataObject.cancerList, cancerlist);
    Object.assign(this.state.cancerInfo, cancerlist);

    this.setState(
      {
        patientDataObject: this.state.patientDataObject,
        cancerInfo: this.state.patientDataObject.cancerList
      },
      () => {
        this.recordEditedData(cancer);
      }
    );
  }
  closeCancerDialog() {
    this.setState({
      showAddCancerDialog: false
    });
  }

  closeCancerEditDialog() {
    this.setState({
      showEditCancerDialog: false
    });
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

  componentDidUpdate(prevProps) {
    console.log("In didupdate");

    const { success: wasSuccess = false } = prevProps.status || {};
    const { success: isSuccess = false } = this.props.status || {};
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
          tumorId={cancer.tumorNo}
          cancerInfo={cancer}
          handleShow={this.handleShowEditCancer}
        />
      );
    });
    var style = {
      marginBottom: "8px",
      fontWeight: "bold"
    };
    return (
      <div>
        <HeaderPanel patientDetials={this.state.patientData} />
        <p> Cancer Information</p>
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
        {this.state.showAddCancerDialog ? (
          <AddCancer
            patientData={this.state.patientData}
            showAddCancerDialog={this.state.showAddCancerDialog}
            onSaveCancer={this.refreshCancerList.bind(this)}
            oncCloseCancer={this.closeCancerDialog.bind(this)}
          />
        ) : null}
        {this.state.showEditCancerDialog ? (
          <EditCancer
            cancer={this.state.cancer}
            patientData={this.state.patientData}
            showEditCancerDialog={this.state.showEditCancerDialog}
            onSaveCancer={this.refresEditedhCancerList.bind(this)}
            onCloseCancer={this.closeCancerEditDialog.bind(this)}
          />
        ) : null}
        {/* <div /> */}
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
      <td>{props.cancerInfo.histology}</td>

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
        <Button
          bsSize="small"
          onClick={() => props.handleShow(props.tumorId, props.rowId)}
        >
          {" "}
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
