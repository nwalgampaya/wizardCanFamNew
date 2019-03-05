import React from "react";
import ReactDOM from "react-dom";
import { Field } from "react-final-form";
import DatePicker from "react-date-picker";
import { withFormik, Form } from "formik";
import * as Yup from "yup";
import "../App.css";
import "../index.css";
import "../styles/styles.scss";
import Wizard from "../Wizard";
import Welcome from "./steps/Welcome.js";
import CancerInfo from "./steps/CancerInfo";
import BootstrapDialog from "./dialog/BootstrapDialog";
import PreviewInfo from "./steps/PreviewInfo";
import ChoosePath from "./steps/ChoosePath";
import Individual from "./steps/Individual";
import Family from "./steps/Family";
import FamilySearch from "./steps/FamilySearch";
import IndividualFinish from "./steps/IndividualFinish";
import { properties } from "../properties.js";
import DateSelect from "./util/DateSelect";
import FamilySaveInfo from "./steps/FamilySaveInfo";
import DeathDateSelect from "./util/DeathDateSelect";
import HeaderPanel from "./HeaderPanel";
import FamilyFinish from "./steps/FamilyFinish";

// import FormValidator from './validator/FormValidator';

// import CancerInfo from './steps/CancerInfo'
// import DropdownMenu, { DropdownItemGroup, DropdownItem } from '@atlaskit/dropdown-menu';

// import ComboDatePicker from '../reactComboDatePicker.js'

class CancerFamilyReg extends React.Component {
  constructor(props) {
    super(props);
    // this.validator = new FormValidator([
    //     {
    //         field: 'currentDOB',
    //         method: 'isEmpty',
    //         validWhen: false,
    //         message: 'Value is required.'
    //     },
    // ]);
    // this.submitted = false;
    this.child = React.createRef();
    this.state = {
      // Values form Db

      patientData: null,
      gender: "Male@gmail.com",
      // gender: '',
      dateOFDOB: "mm/dd/yyyy",
      status: "zzz",
      dateOfDeath: "1/1/1",
      //todu
      aodeath: "",
      sourceOFDeath: {
        id: "",
        code: "",
        description: ""
      },
      courseOFDeath: {
        id: "",
        description: ""
      },
      dateOfLKDA: "",
      sourceOfLiveDate: {
        id: "",
        code: "",
        description: ""
      },

      fPI1Status: {
        id: "",
        code: "",
        description: ""
      },
      fPI2Status: {
        id: "",
        code: "",
        description: ""
      },

      fPI3Status: {
        id: "",
        code: "",
        description: ""
      },

      fPI4Status: {
        id: "",
        code: "",
        description: ""
      },

      relationshipCode: {
        code: "",
        description: ""
      },
      errors: {},
      // current values
      currentGender: "",
      currentDOB: "", // Date picker can display only this format.
      sendCurrentDOB: "", // Same value as currentDOB, but different format to send,
      currentStatus: "",
      currentDeath: "",
      sendCurrentDateDeath: "", // Same value as currentDeath, but different format to send,
      //todu
      currentaodeath: "",
      currentSourceOFDeath: "",
      currentCourseOFDeath: "",
      uknCourseOFDeath: false,
      currentLKDA: "",
      sendCurrentLKDA: "",
      // currentsourceOfLiveDate:'',
      currentCourseOfLiveDate: "",
      currentfPI1Status: "",
      currentfPI2Status: "",
      currentfPI3Status: "",
      currentfPI4Status: "",
      currentRelationshipCode: "",

      // Boolean Values
      isAlive: false,
      isDODNotNull: false,
      isAgeCalculated: false,

      // Values from Rest Service
      existingPersonData: [],
      fupcodesRest: [],
      srcOfDeathRest: [],
      lastKnownDatesRest: [],
      relcodesRest: [],

      // isModalOpen:'',

      //To assign Values from CancerInfo
      changedParameters: [],
      cancerInfoArr: [],
      isCancerEdited: "",
      isCanecerAdded: "",

      //Used to get the selection between the family and the individual
      choosePathFamily: "",

      //This object is used to carry the edited data to the preview screen
      // changedField:{
      //     id:'',
      //     column:'',
      //     previousVal:'',
      //     newVal:'',
      //   },
      arrayOfChangedFields: [],
      countChangedFields: 0,
      columnExist: false,

      //Transfered from StartPageRegistry
      firstPage: "",
      secoundPage: "",
      thirdPage: "",
      fourthPage: "",
      IndividualFinish: "",

      //Family path
      sixthPage: "",
      sevenththPage: "",

      //Get data from child
      // arrayOfChangedFields:[],
      //Transfered from StartPageRegistry

      patientDataValue: [],

      // Values after Editing OR Adding New cancer with 'EDIT' OR 'Add Cancer' dialog
      // patientDataObjectChanged: [],

      // Values after Adding new canceer with 'Add Cancer' dialog
      newCancerArr: [],

      isInPreviewScreen: false,

      selectedYear: "",
      selectedMonth: "",
      selectedDate: "",

      selectedYearLKD: "",
      selectedMonthLKD: "",
      selectedDateLKD: "",

      selectedYearDOB: "",
      selectedMonthDOB: "",
      selectedDateDOB: "",

      // FamilySearch page
      chkBoxId: "",
      selectedSrlCode: "",
      currentLKD: "",
      isCanFamEdited: false,
      isValidBirthDateSelected: false,
      isValidLKDSelected: false,
      isValidDeathSelected: false,
      isChecked: false,

      existingLKDDate: null,
      isExistingLKDDate: false,

      existingDeathDate: null,
      isExistingDeathDate: false,

      existingBirthDate: null,
      isExistingBirthDate: false,
      childInvidiualCmp: null,
      wizardCmp: null
    };
    this.oncurrentDOBChange = this.oncurrentDOBChange.bind(this);
    this.setCurrentLKDA = this.setCurrentLKDA.bind(this);
    this.setCurrentDateDeath = this.setCurrentDateDeath.bind(this);
    this.setcurrentRelationshipCode = this.setcurrentRelationshipCode.bind(
      this
    );
    this.assignDbDataToFields = this.assignDbDataToFields.bind(this);
    this.setAgeOfDeath = this.setAgeOfDeath.bind(this);
  }

  //Transfered from StartPageRegistry

  // handleChooseOption = (chooseTheFamily) => {
  //     this.setState({choosePathFamily: chooseTheFamily});

  // }

  choosePath() {
    console.log("SELECTED OPTION family" + this.state.choosePathFamily);
    if (this.state.choosePathFamily) {
      //  fourthPage:'',
      this.state.sixthPage = (
        <FamilySearch
          ref={this.child}
          onFamilySearch={this.handleDataFromFamilySearch}
          onProceedButton={this.handleChkFlagFamilySearch}
        />
      );

      return this.state.sixthPage;
      //  <Family />;
    } else {
      // this.state.secoundPage=<CancerInfo onSaveChangeInfo={this.handleChangedRecFrmChild} arrayEditedData= {this.state.arrayEditedData}/>
      // this.state.firstPage= <FormikApp />
      // ref={this.child} toMakePerviewFlagFalse={this.handlePerviewFlagState}
      this.state.secoundPage = (
        <CancerInfo
          onSaveChangeInfo={this.handleChangedRecFrmChild}
          onSaveNewInfo={this.handleNewRecFrmChild}
          arrayEditedData={this.state.arrayEditedData}
          patientDataValue={this.state.patientDataValue}
          newCancerArr={this.state.newCancerArr}
          patientData={this.state.patientData}
        />
      );
      this.state.thirdPage = (
        <PreviewInfo
          isCanFamEdited={this.state.isCanFamEdited}
          ref={this.child}
          onPreviewPage={this.handleDataFromPreviewPage}
          arrayEditedData={this.state.arrayEditedData}
          newCancerArr={this.state.newCancerArr}
          isCanecerAdded={this.state.isCanecerAdded}
          isCancerEdited={this.state.isCancerEdited}
          arrayOfChangedFields={this.state.arrayOfChangedFields}
          patientData={this.state.patientData}
        />
      ); // patientDataObjectChanged={this.state.patientDataObjectChanged}
      this.state.IndividualFinish = <IndividualFinish />;
      return (
        <Individual
          ref={childInvidiualCmp => {
            this.childInvidiualCmp = childInvidiualCmp;
          }}
          onInsertPatientId={this.assignDbDataToFields}
        />
      );
    }
  }

  // handleChangedRecFrmChild = (arrayEditedDataArr, isCancerEdited, patientDataObject ) => {

  //     console.log("#####################finalObject :: " + patientDataObject.cancerList[1].id)
  //     this.setState({arrayEditedData: arrayEditedDataArr});
  //     this.setState({isCancerEdited : isCancerEdited});

  // }
  //Transfered from StartPageRegistry

  // This function is used to fill an array to carry the -New Details- data to the preview screen
  setPreviewScreenData(columnName, previousValue, nextValue) {
    // var columnExist = false;

    //Have to initiate a fresh object of 'changedField' in every scenario or will get fault results
    var changedField = new Object();
    if (this.state.arrayOfChangedFields.length != 0) {
      this.state.arrayOfChangedFields.map((value, i) => {
        if (value.column == columnName) {
          changedField.column = columnName;
          changedField.previousVal = previousValue;
          changedField.newVal = nextValue;
          this.state.arrayOfChangedFields[i] = changedField;
          console.log("values :" + i + " : " + value.column);
          console.log("values :" + i + " : " + columnName);
          this.state.columnExist = true;
        }

        if (columnName == "Cause Of Death" || columnName == "Source Of Death") {
          // || columnName == "Relationship Code" || columnName == "Source Of LiveDate ")
          // changeCol.column = "Site"
          // if (changedField.previousVal != '') {
          changedField.previousVal =
            changedField.previousVal != "" ? previousValue.description : "";
          // }

          console.log(
            "Cause Of Death --------------------------------" +
              changedField.previousVal
          );
        }
        // if (columnName == "Relationship Code") {
        //     // changeCol.column = "Site"
        //     // if (changedField.previousVal != '') {
        //     changedField.previousVal = changedField.previousVal != '' ? changedField.previousVal.description : '';
        //     // }

        //     console.log("Relationship Code --------------------------------" + changedField.previousVal)
        // }
      });

      if (!this.state.columnExist) {
        changedField.column = columnName;
        changedField.previousVal = previousValue;
        changedField.newVal = nextValue;
        this.state.arrayOfChangedFields[
          this.state.countChangedFields
        ] = changedField;
        console.log(
          "values noteq :" + this.state.countChangedFields + " : " + columnName
        );
        // this.state.columnExist=false;

        if (columnName == "Cause Of Death" || columnName == "Source Of Death") {
          // || columnName == "Relationship Code" || columnName == "Source Of LiveDate ")
          // changeCol.column = "Site"
          // if (changedField.previousVal != '') {
          changedField.previousVal =
            changedField.previousVal != "" ? previousValue.description : "";
          // }

          console.log(
            "Cause Of Death --------------------------------" +
              changedField.previousVal
          );
        }
        this.setState({ countChangedFields: ++this.state.countChangedFields });
      }
      this.state.columnExist = false;
    } else {
      this.state.isCanFamEdited = true;
      // var changedField= new  Object;
      changedField.column = columnName;
      changedField.previousVal = previousValue;
      changedField.newVal = nextValue;
      this.state.arrayOfChangedFields[
        this.state.countChangedFields
      ] = changedField;
      console.log("First Time: " + this.state.countChangedFields + " : ");
      console.log("First Time: columnName " + columnName);

      this.setState({ countChangedFields: ++this.state.countChangedFields });

      if (columnName == "Cause Of Death" || columnName == "Source Of Death") {
        // || columnName == "Relationship Code" || columnName == "Source Of LiveDate ")
        // changeCol.column = "Site"
        // if (changedField.previousVal != '') {
        changedField.previousVal =
          changedField.previousVal != "" ? previousValue.description : "";
        // }

        console.log(
          "Cause Of Death --------------------------------" +
            changedField.previousVal
        );
      }
    }

    console.log("countChangedFields" + this.state.countChangedFields);

    //ToDo remove
    this.state.arrayOfChangedFields.map((value, i) => {
      console.log("values :" + i + " : " + value.column);
      console.log("values :" + i + " : " + value.newVal);
    });

    // Send the filled Array to parent as and when data is filled
    // this.props.onSendDataToPreview(this.state.arrayOfChangedFields)
  }
  setSex(event) {
    console.log("Sex :" + event.target.value);
    this.setState({
      currentGender: event.target.value
    });

    if (this.state.gender != event.target.value) {
      this.setPreviewScreenData(
        "Gender",
        this.state.gender,
        event.target.value
      );
    }
  }
  oncurrentDOBChange(currentDOB) {
    console.log("currentDOB :" + currentDOB);
    this.setState({
      // currentDOB: currentDOB
      currentDOB: currentDOB
    });

    this.state.sendCurrentDOB = this.convert(currentDOB);

    console.log(
      "currentDOB : ddddddddddddddddddddddd : " + this.state.sendCurrentDOB
    );
  }
  convert(str) {
    console.log("ddddddddddddddddddddddd" + str);
    var str2 = "" + str;

    // var mnth = str2.slice(4,7)
    // var date = str2.slice(9,10)
    // var year = str2.slice(12,15)

    // console.log("Mnt" + mnth)
    var mnths = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
      },
      date = str2.split(" ");

    // console.log("date new 1" + date[1])
    // console.log("date new 2" + date[2])
    // console.log("date new 3" + date[3])
    // return [ date[3], mnths[date[1]], date[2] ].join("-");
    return [date[3], mnths[date[1]], date[2]].join("");
  }

  // convert(str) {
  //     var date = new Date(str),
  //         mnth = ("0" + (date.getMonth()+1)).slice(-2),
  //         day  = ("0" + date.getDate()).slice(-2);
  //     return [ date.getFullYear(), mnth, day ].join("-");
  // }
  // onnewdobChange = newdob => this.setState({ newdob })

  /** Start date pick for "Date of Death" */
  //Conditions used to make null select box values when selecting the topics (eg: Year,Month, Date)
  handleYearPickedDod = (selectedYear, e) => {
    console.log("handleYearPicked : " + selectedYear);
    // console.log("handleYearPicked : " + e.target.valu)
    this.setState(
      { selectedYear: selectedYear != "Year" ? selectedYear : "" },
      () => this.onChangeDeathDate()
    );
  };

  handleMonthPickedDod = selectedMonth => {
    console.log("Month Picked : " + selectedMonth);
    this.setState(
      { selectedMonth: selectedMonth != "Year" ? selectedMonth : "" },
      () => this.onChangeDeathDate()
    );
  };

  handleDatePickedDod = selectedDate => {
    console.log("Date    Picked : " + selectedDate);
    this.setState(
      { selectedDate: selectedDate != "Year" ? selectedDate : "" },
      () => this.onChangeDeathDate()
    );
  };
  /** End date pick for "Date of Death" */

  /** Start date pick for "Last Known Date" */

  handleYearPickedLKD = (selectedYearLKD, e) => {
    console.log("handleYearPicked : " + selectedYearLKD);
    this.setState({
      selectedYearLKD: selectedYearLKD != "Year" ? selectedYearLKD : ""
    });
  };
  handleMonthPickedLKD = selectedMonthLKD => {
    console.log("Month Picked : " + selectedMonthLKD);
    this.setState({
      selectedMonthLKD: selectedMonthLKD != "Month" ? selectedMonthLKD : ""
    });
  };
  handleDatePickedLKD = selectedDateLKD => {
    console.log("Date    Picked : " + selectedDateLKD);
    this.setState({
      selectedDateLKD: selectedDateLKD != "Day" ? selectedDateLKD : ""
    });
  };
  /** End date pick for "Last Known Date" */

  /** Start date pick for "Date of Birth:" */

  handleYearPickedDOB = (selectedYearDOB, e) => {
    console.log("handleYearPicked : " + selectedYearDOB);
    this.setState(
      {
        selectedYearDOB: selectedYearDOB != "Year" ? selectedYearDOB : ""
      },
      () => this.onChangeDeathDate()
    );
    console.log("handleYearPicked : " + this.state.selectedYearDOB);
  };
  handleMonthPickedDOB = selectedMonthDOB => {
    console.log("Month Picked : " + selectedMonthDOB);
    this.setState(
      {
        selectedMonthDOB: selectedMonthDOB != "Month" ? selectedMonthDOB : ""
      },
      () => this.onChangeDeathDate()
    );
  };
  handleDatePickedDOB = selectedDateDOB => {
    console.log("Date    Picked : " + selectedDateDOB);
    this.setState(
      {
        selectedDateDOB: selectedDateDOB != "Day" ? selectedDateDOB : ""
      },
      () => this.onChangeDeathDate()
    );
  };
  /** End date pick for "Date of Birth:" */
  createDate(e) {
    console.log("createDate" + e.target.value);
  }

  onChangeDeathDate() {
    if (
      this.state.selectedDate != "" &&
      this.state.selectedMonth != "" &&
      this.state.selectedYear != "" &&
      this.state.selectedYear != "9999"
    ) {
      var deathDate = this.getDate(
        this.state.selectedDate,
        this.state.selectedMonth,
        this.state.selectedYear
      );
      if (
        this.state.isValidBirthDateSelected &&
        this.state.selectedYearDOB != "9999"
      ) {
        var birthDate = this.getDate(
          this.state.selectedDateDOB,
          this.state.selectedMonthDOB,
          this.state.selectedYearDOB
        );
        var age = this.getAge(deathDate, birthDate);
        this.isAgeCalculated = true;
        this.state.currentaodeath = age;
        this.setState({ currentaodeath: age, isAgeCalculated: true });

        console.log("AGE IS " + age);
      } else if (this.state.isExistingBirthDate) {
        var currentBirthDate = this.state.existingBirthDate;
        if (typeof currentBirthDate !== "undefined") {
          var age = this.getAge(deathDate, currentBirthDate);
          this.isAgeCalculated = true;
          this.state.currentaodeath = age;
          this.setState({ currentaodeath: age, isAgeCalculated: true });
        }
      } else if (this.state.selectedYearDOB != "9999") {
        var birthDate = this.getDate(
          this.state.selectedDateDOB,
          this.state.selectedMonthDOB,
          this.state.selectedYearDOB
        );
        var age = this.getAge(deathDate, birthDate);
        this.isAgeCalculated = true;
        this.state.currentaodeath = age;
        this.setState({ currentaodeath: age, isAgeCalculated: true });
      }
    }
    // console.log("validateDeathDate" + e);
  }

  //     handleYearPicked(selectedYear){
  // console.log("YEAR PICKED" + event.target.value)
  //     }
  setCurrentStatus(event) {
    console.log("in SetCurrentStatus");
    if (event.target.value == 2) {
      this.setState({
        isAlive: false
      });
    } else {
      this.setState({
        isAlive: true
      });
    }
    this.setState({
      currentStatus: event.target.value
    });

    if (this.state.status != event.target.value) {
      this.setPreviewScreenData(
        "Vital Status",
        this.state.status,
        event.target.value
      );
    }
  }

  setCurrentDateDeath(currentDeath) {
    this.setState({
      currentDeath: currentDeath
    });
    this.state.sendCurrentDateDeath = this.convert(currentDeath);
    console.log(
      "sendCurrentDateDeath : ddddddddddddddddddddddd : " +
        this.state.sendCurrentDateDeath
    );
  }
  setAgeOfDeath(event) {
    console.log(" aOD" + event.target.value);
    this.setState({
      currentaodeath: event.target.value
    });

    if (this.state.currentaodeath != event.target.value) {
      this.setPreviewScreenData(
        "Death Age ",
        this.state.aodeath,
        this.state.currentaodeath
      );
    }
  }
  setCurrentSource(event) {
    this.setState({
      currentSourceOFDeath: event.target.value
    });

    if (this.state.currentSourceOFDeath != event.target.value) {
      this.setPreviewScreenData(
        "Source Of Death",
        this.state.sourceOFDeath,
        event.target.value
      );
    }
  }

  setCurrentCauseDeath(event) {
    console.log("currentCourseOFDeath :" + event.target.value);
    this.setState({
      currentCourseOFDeath: event.target.value
    });
  }

  setUnknownCauseDeath(event) {
    console.log("setUnknownCauseDeath :" + event.target.checked);

    // this.state.uknCourseOFDeath=false;
    this.setState({
      uknCourseOFDeath: event.target.checked
    });
  }
  setCurrentLKDA(currentLKDA) {
    console.log("setCurrentLKDA :" + currentLKDA);
    this.setState({
      currentLKDA: currentLKDA
    });
    this.state.sendCurrentLKDA = this.convert(currentLKDA);
    console.log(
      "sendCurrentDateDeath : ddddddddddddddddddddddd : " +
        this.state.sendCurrentLKDA
    );
  }

  setSourceLKD(event) {
    console.log("setSourceLKD :" + event.target.value);
    this.setState({
      currentCourseOfLiveDate: event.target.value
    });
    if (this.state.currentCourseOfLiveDate != event.target.value) {
      this.setPreviewScreenData(
        "Source Of LiveDate ",
        this.state.sourceOfLiveDate.description,
        event.target.value
      );
    }
  }

  setcurrentfPI1Status(event) {
    console.log("setcurrentfPI1Status :" + event.target.value);
    this.setState({
      currentfPI1Status: event.target.value
    });
    if (
      this.state.fPI1Status.description != event.target.value &&
      event.target.value != "Choose One"
    ) {
      this.setPreviewScreenData(
        "FUP1 Status ",
        this.state.fPI1Status.description,
        event.target.value
      );
    }
  }
  setcurrentfPI2Status(event) {
    console.log("setcurrentfPI2Status :" + event.target.value);
    this.setState({
      currentfPI2Status: event.target.value
    });
    if (
      this.state.fPI2Status.description != event.target.value &&
      event.target.value != "Choose One"
    ) {
      this.setPreviewScreenData(
        "FUP2 Status ",
        this.state.fPI2Status.description,
        event.target.value
      );
    }
  }
  setcurrentfPI3Status(event) {
    console.log("setcurrentfPI3Status :" + event.target.value);
    this.setState({
      currentfPI3Status: event.target.value
    });
    if (
      this.state.fPI3Status.description != event.target.value &&
      event.target.value != "Choose One"
    ) {
      this.setPreviewScreenData(
        "FUP3 Status ",
        this.state.fPI3Status.description,
        event.target.value
      );
    }
  }
  setcurrentfPI4Status(event) {
    console.log("setcurrentfPI4Status :" + event.target.value);
    this.setState({
      currentfPI4Status: event.target.value
    });
    if (
      this.state.fPI4Status.description != event.target.value &&
      event.target.value != "Choose One"
    ) {
      this.setPreviewScreenData(
        "FUP4 Status ",
        this.state.fPI4Status.description,
        event.target.value
      );
    }
  }

  setcurrentRelationshipCode(event) {
    console.log("setcurrentRelationshipCode :" + event.target.value);
    this.setState({
      currentRelationshipCode: event.target.value
    });
    if (
      this.state.relationshipCode.description != event.target.value &&
      event.target.value != "Choose One"
    ) {
      this.setPreviewScreenData(
        "Relationship Code ",
        this.state.relationshipCode.description,
        event.target.value
      );
    }
  }

  // getFromDB(){
  //     // existingPersonData

  //     // const urlProfession = properties.baseUrl + "professions/";
  //     const urlProfession =  "professions/";
  //     fetch(urlProfession)
  //       .then(response => response.json())
  //       .then((data) => {

  //         console.log(data);
  //         this.setState({
  //             existingPersonData: data,

  //         });

  //         this.assignDbDataToFields()
  //         // this.state.profession.push(data);
  //       })

  // }

  componentDidMount() {
    const urlFupcodes = properties.baseUrl + "fupcodes/";
    fetch(urlFupcodes)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          fupcodesRest: data
        });
        // this.state.profession.push(data);
      });
    const urlSrcOfDeath = properties.baseUrl + "srcDeathcodes/";
    fetch(urlSrcOfDeath)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          srcOfDeathRest: data
        });
        // this.state.profession.push(data);
      });

    const urlLastKnownDates = properties.baseUrl + "srlcodes/";
    fetch(urlLastKnownDates)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          lastKnownDatesRest: data
        });
        // this.state.profession.push(data);
      });
    const urlrelcodes = properties.baseUrl + "relcodes/";
    fetch(urlrelcodes)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          relcodesRest: data
        });
        // this.state.profession.push(data);
      });
  }

  // To assign values form data base to 'Existing Details" variables.
  assignDbDataToFields(patientData) {
    this.state.patientData = patientData;

    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" + patientData.dateOfBirth);
    this.state.patientDataValue = patientData;
    (this.state.gender = patientData.intGender), //read.gender,
      // this.state.dateOFDOB= patientData.dateOfBirth,
      this.setState({
        gender:
          patientData.intGender == 1
            ? "Male"
            : patientData.intGender == 2
            ? "Female"
            : "Unknown"
      });
    console.log(
      "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE intGender" + patientData.intGender
    );

    this.setState({
      dateOFDOB: this.convertDateFormat(patientData.dateOfBirth)
    });
    console.log("dft: " + this.convertDateFormat(patientData.dateOfBirth));
    // this.state.status = patientData.vitalStatus
    this.setState({
      status:
        patientData.vitalStatus == 1
          ? "Alive"
          : patientData.vitalStatus == 2
          ? "Dead"
          : "Unknown"
    });
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE" + this.state.dateOFDOB);
    this.setState({
      dateOfDeath:
        patientData.dateOfDeath == null
          ? ""
          : this.convertDateFormat(patientData.dateOfDeath)
      // this.convertDateFormat(patientData.dateOfDeath),
    });

    // this.state.dateOfDeath= patientData.dateOfDeath,
    // //this.state.= //this.existingPersonData.//u
    // this.state.aodeath= patientData.aodeath,

    this.setState({
      aodeath: patientData.ageOfDeath
    });
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE aodeath" + this.state.aodeath);

    this.setState({
      sourceOFDeath: {
        id:
          patientData.sourceOfDeath == null ? "" : patientData.sourceOfDeath.id,
        description:
          patientData.sourceOfDeath == null
            ? ""
            : patientData.sourceOfDeath.description
      }
    });

    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE sourceOFDeath");

    this.setState({
      courseOFDeath: {
        id:
          patientData.courseOfDeath == null ? "" : patientData.courseOfDeath.id,
        description:
          patientData.courseOfDeath == null
            ? ""
            : patientData.courseOfDeath.description
        // code: patientData.sourceOfLiveDate.code,
        // patientData.courseOfDeath,
      }
    });
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEE courseOfDeath");

    // this.setState({
    //     sourceOfLiveDate: patientData.sourceOfLiveDate,

    // });

    if (
      patientData.dateOfDeath != null &&
      patientData.dateOfDeath.length == 8
    ) {
      var dt1 = parseInt(patientData.dateOfDeath.substring(6));
      var mon1 = parseInt(patientData.dateOfDeath.substring(4, 6));
      var yr1 = parseInt(patientData.dateOfDeath.substring(0, 4));
      var date1 = new Date(yr1, mon1 - 1, dt1);
      this.state.existingDeathDate = date1;
      this.state.isExistingDeathDate = true;
    }

    if (patientData.liveDate != null && patientData.liveDate.length == 8) {
      var dt1 = parseInt(patientData.liveDate.substring(6));
      var mon1 = parseInt(patientData.liveDate.substring(4, 6));
      var yr1 = parseInt(patientData.liveDate.substring(0, 4));
      var date1 = new Date(yr1, mon1 - 1, dt1);
      this.state.existingLKDDate = date1;
      this.state.isExistingLKDDate = true;
    }

    if (
      patientData.dateOfBirth != null &&
      patientData.dateOfBirth.length == 8
    ) {
      var dt1 = parseInt(patientData.dateOfBirth.substring(6));
      var mon1 = parseInt(patientData.dateOfBirth.substring(4, 6));
      var yr1 = parseInt(patientData.dateOfBirth.substring(0, 4));
      var date1 = new Date(yr1, mon1 - 1, dt1);
      this.state.existingBirthDate = date1;
      this.state.isExistingBirthDate = true;
    }
    console.log("existing lkd" + this.state.existingLKDDate);

    this.setState({
      dateOfLKDA: this.convertDateFormat(patientData.liveDate)
    });
    // this.state.sourceOFDeath= patientData.sourceOFDeath,
    // this.state.courseOFDeath= patientData.courseOFDeath,
    // this.state.dateOfLKDA= patientData.dateOfLKDA,
    // this.state.sourceOfLiveDate= patientData.sourceOfLiveDate,

    this.setState({
      sourceOfLiveDate: {
        id: patientData.sourceOfLiveDate.id,
        code: patientData.sourceOfLiveDate.code,
        description: patientData.sourceOfLiveDate.description

        //  patientData.sourceOfLiveDate != null ?                 : ''
        //  patientData.sourceOfLiveDate != null ? : ''
        //  patientData.sourceOfLiveDate != null ?             : ''
      }
    });

    this.setState({
      fPI1Status: {
        id: patientData.fPI1Status != null ? patientData.fPI1Status.id : "",
        code: patientData.fPI1Status != null ? patientData.fPI1Status.code : "",
        description:
          patientData.fPI1Status != null
            ? patientData.fPI1Status.description
            : ""
      }
    });
    this.setState({
      fPI2Status: {
        id: patientData.fPI2Status != null ? patientData.fPI2Status.id : "",
        code: patientData.fPI2Status != null ? patientData.fPI2Status.code : "",
        description:
          patientData.fPI2Status != null
            ? patientData.fPI2Status.description
            : ""
      }
    });
    this.setState({
      fPI3Status: {
        id: patientData.fPI3Status != null ? patientData.fPI3Status.id : "",
        code: patientData.fPI3Status != null ? patientData.fPI3Status.code : "",
        description:
          patientData.fPI3Status != null
            ? patientData.fPI3Status.description
            : ""
      }
    });
    this.setState({
      fPI4Status: {
        id: patientData.fPI4Status != null ? patientData.fPI4Status.id : "",
        code: patientData.fPI4Status != null ? patientData.fPI4Status.code : "",
        description:
          patientData.fPI4Status != null
            ? patientData.fPI4Status.description
            : ""
      }
    });
    this.setState({
      relationshipCode: {
        // id: patientData.fPI4Status != null ? patientData.fPI4Status.id : '',
        code:
          patientData.membership.relationshipCode != null
            ? patientData.membership.relationshipCode.code
            : "",
        description:
          patientData.membership.relationshipCode != null
            ? patientData.membership.relationshipCode.description
            : ""
      }
    });

    this.wizardCmp.navigateNextOnSuccess();

    // this.state.fPI1Status= patientData.fPI1Status,
    // this.state.fPI2Status= patientData.fPI2Status,
    // this.state.fPI3Status= patientData.fPI3Status,
    // this.state.fPI4Status= patientData.fPI4Status,
    // this.state.relationshipCode= patientData.relationshipCode
  }
  //  // To assign values form data base to 'Existing Details" variables.
  //     assignDbDataToFields(patientData){

  //         this.state.existingPersonData.map((read, i) => {
  //             this.state.gender= 'Female', //read.gender,
  //             this.state.dateOFDOB= read.dateOFDOB,
  //             this.state.status= read.status,
  //             this.state.dateOfDeath= read.dateOfDeath,
  //             //this.state.= //this.existingPersonData.//u
  //             this.state.aodeath= read.aodeath,
  //             this.state.sourceOFDeath= read.sourceOFDeath,
  //             this.state.courseOFDeath= read.courseOFDeath,
  //             this.state.dateOfLKDA= read.dateOfLKDA,
  //             this.state.sourceOfLiveDate= read.sourceOfLiveDate,
  //             this.state.fPI1Status= read.fPI1Status,
  //             this.state.fPI2Status= read.fPI2Status,
  //             this.state.fPI3Status= read.fPI3Status,
  //             this.state.fPI4Status= read.fPI4Status,
  //             this.state.relationshipCode= read.relationshipCode
  //         })
  //     }

  setParamCodeANDId(description, dataFromFetch) {
    var fieldValues;
    dataFromFetch.map((values, i) => {
      console.log("siteData loop: " + values.description);

      if (values.description == description) {
        console.log("siteData : " + values.description);
        fieldValues = values;
      }
    });
    return fieldValues;
  }

  // Used for saving 'New Details' to the db
  postRequest() {
    if (
      this.state.currentGender != this.state.gender &&
      this.state.currentGender != ""
    ) {
      console.log("IN POST REQUEST gender : " + this.state.gender);
      console.log("IN POST REQUEST gender : " + this.state.currentGender);
      // this.state.patientDataValue.intGender = (this.state.patientDataValue.intGender == '' ? '' : this.state.currentGender = this.state.currentGender == 1 ? "Male" : this.state.currentGender == 2 ? "Female" : "Unknown");
      this.state.patientDataValue.intGender = this.state.currentGender;
    }
    // if (this.state.sendCurrentDOB != this.state.dateOFDOB && this.state.sendCurrentDOB != '') {
    if (
      this.state.currentDOB != this.state.dateOFDOB &&
      this.state.currentDOB != ""
    ) {
      this.state.currentDOB =
        this.state.selectedYearDOB +
        this.state.selectedMonthDOB +
        this.state.selectedDateDOB;

      console.log("IN POST REQUEST dateOFDOB : " + this.state.currentDOB);

      this.state.patientDataValue.dateOfBirth =
        this.state.patientDataValue.dateOfBirth == ""
          ? ""
          : this.state.currentDOB;
    }
    if (
      this.state.currentStatus != this.state.status &&
      this.state.currentStatus != ""
    ) {
      console.log("IN POST REQUEST status : " + this.state.status);

      this.state.patientDataValue.status =
        this.state.patientDataValue.status == ""
          ? ""
          : this.state.currentStatus;
    }
    if (
      this.state.currentDeath != this.state.dateOfDeath &&
      this.state.currentDeath != ""
    ) {
      this.state.currentDeath =
        this.state.selectedYear +
        this.state.selectedMonth +
        this.state.selectedDate;

      this.state.patientDataValue.dateOfDeath =
        this.state.patientDataValue.dateOfDeath == ""
          ? ""
          : this.state.currentDeath;

      //Calculate the Age of Death
      // this.state.currentaodeath = this.getYearsFromDate(new Date(this.state.currentDeath), new Date(this.state.dateOFDOB))
    }
    if (
      this.state.currentaodeath != this.state.aodeath &&
      this.state.currentaodeath != ""
    ) {
      this.state.patientDataValue.ageOfDeath =
        this.state.patientDataValue.ageOfDeath == ""
          ? ""
          : this.state.currentaodeath;
    }
    if (
      this.state.currentSourceOFDeath != this.state.sourceOFDeath &&
      this.state.currentSourceOFDeath != ""
    ) {
      this.state.patientDataValue.sourceOfDeath =
        this.state.patientDataValue.sourceOfDeath == ""
          ? ""
          : this.state.currentSourceOFDeath;
      var fieldValues = this.setParamCodeANDId(
        this.state.currentSourceOFDeath,
        this.state.srcOfDeathRest
      );
      console.log(
        "IN POST REQUEST currentSourceOFDeath  code: " + fieldValues.code
      );

      //Added due to error "id of null"
      this.state.sourceOFDeath.code = fieldValues.code;
      this.state.sourceOFDeath.id = fieldValues.id;
      this.state.sourceOFDeath.description = fieldValues.description;

      this.state.patientDataValue.sourceOfDeath = this.state.sourceOFDeath;
      // code =
      // this.state.patientDataValue.sourceOfDeath.id = fieldValues.id
      console.log(
        "IN POST REQUEST currentSourceOFDeath  id: " +
          this.state.patientDataValue.sourceOfDeath.id
      );
    }
    if (
      this.state.currentCourseOFDeath != this.state.courseOFDeath &&
      this.state.currentCourseOFDeath != ""
    ) {
      console.log(
        "IN POST REQUEST currentCourseOFDeath : " +
          this.state.currentCourseOFDeath
      );

      this.state.patientDataValue.courseOfDeath.description =
        this.state.patientDataValue.courseOfDeath == ""
          ? ""
          : this.state.currentCourseOFDeath;
      // this.state.columnExist = true;
      // to fix error due to typing data to the text box
      this.setPreviewScreenData(
        "Cause Of Death",
        this.state.courseOFDeath,
        this.state.currentCourseOFDeath
      );
    }
    if (
      this.state.currentLKDA != this.state.dateOfLKDA &&
      this.state.currentLKDA != ""
    ) {
      this.state.currentLKDA =
        this.state.selectedYearLKD +
        this.state.selectedMonthLKD +
        this.state.selectedDateLKD;

      this.state.patientDataValue.liveDate =
        this.state.patientDataValue.liveDate == ""
          ? ""
          : this.state.currentLKDA;
    }
    if (
      this.state.currentCourseOfLiveDate != this.state.sourceOfLiveDate &&
      this.state.currentCourseOfLiveDate != ""
    ) {
      this.state.patientDataValue.sourceOfLiveDate.description =
        this.state.patientDataValue.sourceOfLiveDate == ""
          ? ""
          : this.state.currentCourseOfLiveDate;

      var fieldValues = this.setParamCodeANDId(
        this.state.currentCourseOfLiveDate,
        this.state.lastKnownDatesRest
      );
      this.state.patientDataValue.sourceOfLiveDate.code = fieldValues.code;
      this.state.patientDataValue.sourceOfLiveDate.id = fieldValues.id;
      console.log(
        "IN POST REQUEST currentsourceOfLiveDate  id: " +
          this.state.patientDataValue.sourceOfLiveDate.id
      );
    }
    if (
      this.state.currentfPI1Status != this.state.fPI1Status &&
      this.state.currentfPI1Status != ""
    ) {
      console.log(
        "IN POST REQUEST currentfPI1Status : " + this.state.currentfPI1Status
      );

      this.state.patientDataValue.fPI1Status.description =
        this.state.patientDataValue.fPI1Status == ""
          ? ""
          : this.state.currentfPI1Status;

      var fieldValues = this.setParamCodeANDId(
        this.state.currentfPI1Status,
        this.state.fupcodesRest
      );
      this.state.patientDataValue.fPI1Status.code = fieldValues.code;
      this.state.patientDataValue.fPI1Status.id = fieldValues.id;
      console.log(
        "IN POST REQUEST currentfPI1Status  id: " +
          this.state.patientDataValue.fPI1Status.id
      );
    }
    if (
      this.state.currentfPI2Status != this.state.fPI2Status &&
      this.state.currentfPI2Status != ""
    ) {
      this.state.patientDataValue.fPI2Status.description =
        this.state.patientDataValue.fPI2Status == ""
          ? ""
          : this.state.currentfPI2Status;

      var fieldValues = this.setParamCodeANDId(
        this.state.currentfPI2Status,
        this.state.fupcodesRest
      );
      this.state.patientDataValue.fPI2Status.code = fieldValues.code;
      this.state.patientDataValue.fPI2Status.id = fieldValues.id;
    }
    if (
      this.state.currentfPI3Status != this.state.fPI3Status &&
      this.state.currentfPI3Status != ""
    ) {
      this.state.patientDataValue.fPI3Status.description =
        this.state.patientDataValue.fPI3Status == ""
          ? ""
          : this.state.currentfPI3Status;

      var fieldValues = this.setParamCodeANDId(
        this.state.currentfPI3Status,
        this.state.fupcodesRest
      );
      this.state.patientDataValue.fPI3Status.code = fieldValues.code;
      this.state.patientDataValue.fPI3Status.id = fieldValues.id;
    }
    if (
      this.state.currentfPI4Status != this.state.fPI4Status &&
      this.state.currentfPI4Status != ""
    ) {
      this.state.patientDataValue.fPI4Status.description =
        this.state.patientDataValue.fPI4Status == ""
          ? ""
          : this.state.currentfPI4Status;

      var fieldValues = this.setParamCodeANDId(
        this.state.currentfPI4Status,
        this.state.fupcodesRest
      );
      this.state.patientDataValue.fPI4Status.code = fieldValues.code;
      this.state.patientDataValue.fPI4Status.id = fieldValues.id;
    }

    if (
      this.state.currentRelationshipCode != this.state.relationshipCode &&
      this.state.currentRelationshipCode != ""
    ) {
      this.state.patientDataValue.membership.relationshipCode.description =
        this.state.patientDataValue.membership.relationshipCode == ""
          ? ""
          : this.state.currentRelationshipCode;

      var fieldValues = this.setParamCodeANDId(
        this.state.currentRelationshipCode,
        this.state.relcodesRest
      );
      this.state.patientDataValue.membership.relationshipCode.code =
        fieldValues.code;
      // this.state.patientDataValue.relationshipCode.id = fieldValues.id
    }
    // this.state.patientDataObjectChanged == this.state.patientDataValue;

    // this.state.currentRelationshipCode,
    // let postData = {
    //     currentGender: this.state.currentGender,
    //     currentDOB: this.state.sendCurrentDOB,
    //     currentStatus: this.state.currentStatus,
    //     currentDeath: this.state.sendCurrentDateDeath,
    //     currentaodeath: this.state.currentaodeath,
    //     currentSourceOFDeath: this.state.currentSourceOFDeath,
    //     currentCourseOFDeath: this.state.currentCourseOFDeath,
    //     currentLKDA: this.state.sendCurrentLKDA,
    //     currentCourseOfLiveDate: this.state.currentCourseOfLiveDate,
    //     currentfPI1Status: this.state.currentfPI1Status,
    //     currentfPI2Status: this.state.currentfPI2Status,
    //     currentfPI3Status: this.state.currentfPI3Status,
    //     currentRelationshipCode: this.state.currentfPI4Status,
    //     currentRelationshipCode: this.state.currentRelationshipCode,
    // todu
    // currentDeath:this.state.currentDeath,
    // currentDOB:this.state.currentDOB,
    // currentLKDA:this.state.currentLKDA,
    // this.state.urrentsourceOfLiveDate,
    // }
    // console.log(
    //   "postData <><><><><><><><><><><><>" +
    //     this.state.patientDataValue.fPI1Status.description
    // );

    // const url = properties.baseUrl + 'practitioners/create';
    // const url = 'practitioners/create';

    // var request = new Request(url, {
    // method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify(postData),
    // mode: "cors",
    // credentials: "same-origin",
    // crossDomain: true

    // });

    // fetch(request)
    // .then((response) => {
    //     return response.json();
    // })
    // .then((jsonObject) => {
    //     console.log("CREATED ID :" + jsonObject.id);
    //     this.state.jsonId = jsonObject.id;
    //     // document.write(`ID ${jsonObject.id} was created!`);
    // })
    // .then(() => {
    //     if (this.state.jsonId.length !== 0) {
    //     this.fetchPractitionerId(this.state.jsonId)
    //     }
    // })
    // .catch((error) => {
    //     document.write(error);
    // });
  }

  // setDialogState(isModalOpenValue){
  // console.log("isModalOpen&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& : " + isModalOpenValue)
  // this.setState({isModalOpen:isModalOpenValue})
  // this.state.isModalOpen=isModalOpenValue

  // }

  savePatient(patientDataObject) {
    const urlSavePatient =
      properties.baseUrl + "patients/" + patientDataObject.personID;

    var request = new Request(urlSavePatient, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientDataObject),
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
  handleChkFlagFamilySearch = isChecked => {
    console.log("handleChkFlagFamilySearch : " + isChecked);

    this.setState({ isChecked: isChecked });
  };
  handleDataFromFamilySearch = (chkBoxId, selectedSrlCode, currentLKD) => {
    console.log("handleDataFromFamilySearch : " + chkBoxId);
    console.log("handleDataFromFamilySearch : " + selectedSrlCode);
    console.log("handleDataFromFamilySearch : " + currentLKD);

    this.setState({ chkBoxId: chkBoxId });
    this.setState({ selectedSrlCode: selectedSrlCode });
    this.setState({ currentLKD: currentLKD });
  };

  // To set 'isInPreviewScreen' false
  // When in cancerInfo.js and other pages
  // handlePerviewFlagState(isInPreviewScreen) {
  //     console.log("onPreviewPage : " + isInPreviewScreen)

  //     this.setState({ isInPreviewScreen: isInPreviewScreen });

  // }
  handleDataFromPreviewPage = isInPreviewScreen => {
    console.log("onPreviewPage : " + isInPreviewScreen);
    this.setState({ isInPreviewScreen: isInPreviewScreen });
  };
  handleChangedRecFrmChild = (
    arrayEditedDataArr,
    isCancerEdited,
    patientDataObjectChanged
  ) => {
    console.log(
      "##################### CID :: " + patientDataObjectChanged.personCID
    );

    // console.log("#####################finalObject :: " + patientDataObject.cancerList[1].site.description)
    this.setState({ arrayEditedData: arrayEditedDataArr });
    this.setState({ isCancerEdited: isCancerEdited });
    this.setState({ patientDataValue: patientDataObjectChanged });

    // this.savePatient(patientDataObjectChanged);
  };
  handleNewRecFrmChild = (
    arrayNewCancerArr,
    patientDataObjectChanged,
    isCanecerAdded
  ) => {
    // console.log("in New Cancer Arr"+ arrayNewCancerArr.site.id)
    this.setState({ newCancerArr: arrayNewCancerArr });
    this.setState({ patientDataValue: patientDataObjectChanged });
    this.setState({ isCanecerAdded: isCanecerAdded });
  };
  handleChooseOption = chooseTheFamily => {
    this.setState({ choosePathFamily: chooseTheFamily });
  };
  // choosePath(){
  //    console.log("choose path : " + this.state.choosePathFamily)
  //         if(this.state.choosePathFamily){
  //             return <Family/>
  //         }else {
  //             return <Individual />
  //         }

  // }

  validateDeathDate(d, m, y, errors) {
    var currentDeathDate = this.getDate(d, m, y);

    if (this.state.isValidLKDSelected) {
      var currentLKDDate = this.getDate(
        this.state.selectedDateLKD,
        this.state.selectedMonthLKD,
        this.state.selectedYearLKD
      );

      if (
        typeof currentLKDDate !== "undefined" &&
        typeof currentDeathDate !== "undefined"
      ) {
        if (currentLKDDate > currentDeathDate) {
          errors.currentdodColumn =
            "LKD Date cannot be greater than Death Date";
        }
      }
    } else if (this.state.isExistingLKDDate) {
      var existingLKDDate = this.state.existingLKDDate;
      if (
        typeof existingLKDDate !== "undefined" &&
        typeof currentDeathDate !== "undefined"
      ) {
        if (existingLKDDate > currentDeathDate) {
          errors.currentdodColumn =
            "Existing LKD Date cannot be greater than Death Date";
        }
      }
    }

    if (this.state.isValidBirthDateSelected) {
      var currentBirthDate = this.getDate(
        this.state.selectedDateDOB,
        this.state.selectedMonthDOB,
        this.state.selectedYearDOB
      );

      if (
        typeof currentDeathDate !== "undefined" &&
        typeof currentBirthDate !== "undefined"
      ) {
        if (currentBirthDate > currentDeathDate) {
          errors.currentdodColumn =
            "Death Date must be greater than Birth Date";
        }
      }
    } else if (this.state.isExistingBirthDate) {
      var currentBirthDate = this.state.existingBirthDate;
      if (
        typeof currentDeathDate !== "undefined" &&
        typeof currentBirthDate !== "undefined"
      ) {
        if (currentBirthDate > currentDeathDate) {
          errors.currentLkdColumn =
            "Death Date must be greater than Birth Date";
        }
      }
    }
  }

  validateLKDDate(d, m, y, errors) {
    var currentLKDDate = this.getDate(d, m, y);

    if (this.state.isValidBirthDateSelected) {
      var currentBirthDate = this.getDate(
        this.state.selectedDateDOB,
        this.state.selectedMonthDOB,
        this.state.selectedYearDOB
      );

      if (
        typeof currentLKDDate !== "undefined" &&
        typeof currentBirthDate !== "undefined"
      ) {
        if (currentBirthDate > currentLKDDate) {
          errors.currentLkdColumn = "LKD Date should be less than birth date";
        }
      }
    } else if (this.state.isExistingBirthDate) {
      var currentBirthDate = this.state.existingBirthDate;
      if (
        typeof currentLKDDate !== "undefined" &&
        typeof currentBirthDate !== "undefined"
      ) {
        if (currentBirthDate > currentLKDDate) {
          errors.currentLkdColumn =
            "LKD Date should be less than existing birth date";
        }
      }
    }
  }

  validateAgeOfDeath(errors) {
    if (this.state.currentaodeath != "") {
      if (this.state.isValidDeathSelected) {
        var currentDeathDate = this.getDate(
          this.state.selectedDate,
          this.state.selectedMonth,
          this.state.selectedYear
        );

        if (this.state.isValidBirthDateSelected) {
          var currentBirthDate = this.getDate(
            this.state.selectedDateDOB,
            this.state.selectedMonthDOB,
            this.state.selectedYearDOB
          );

          if (
            typeof currentDeathDate !== "undefined" &&
            typeof currentBirthDate !== "undefined"
          ) {
            var age = this.getAge(currentDeathDate, currentBirthDate);
            if (age > this.state.currentaodeath) {
              errors.currentaodeathColumn = "Invalid Age of Death";
            }
          }
        } else if (this.state.isExistingBirthDate) {
          var currentBirthDate = this.state.existingBirthDate;
          if (
            typeof currentDeathDate !== "undefined" &&
            typeof currentBirthDate !== "undefined"
          ) {
            var age = this.getAge(currentDeathDate, currentBirthDate);
            if (age > this.state.currentaodeath) {
              errors.currentaodeathColumn = "Invalid Age of Death";
            }
          }
        }
      } else if (this.state.isExistingDeathDate) {
        var existingDeathDate = this.state.existingDeathDate;
        if (this.state.isValidBirthDateSelected) {
          var currentBirthDate = this.getDate(
            this.state.selectedDateDOB,
            this.state.selectedMonthDOB,
            this.state.selectedYearDOB
          );

          if (
            typeof existingDeathDate !== "undefined" &&
            typeof currentBirthDate !== "undefined"
          ) {
            var age = this.getAge(existingDeathDate, currentBirthDate);
            if (age != this.state.currentaodeath) {
              errors.currentaodeathColumn = "Invalid Age of Death";
            }
          }
        } else if (this.state.isExistingBirthDate) {
          var existingBirthDate = this.state.existingBirthDate;
          if (
            typeof existingDeathDate !== "undefined" &&
            typeof existingBirthDate !== "undefined"
          ) {
            var age = this.getAge(existingDeathDate, existingBirthDate);
            if (age != this.state.currentaodeath) {
              errors.currentaodeathColumn = "Invalid Age of Death";
            }
          }
        }
      }
    }
  }

  validateBirthDate(d, m, y, errors) {
    var currentDate = this.getDate(d, m, y);
    var today = new Date();

    if (currentDate > today)
      errors.currentdobColumn = "Date Of Birth should be lessthan todays date";
  }
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

  onSavePatientOnly(e) {
    console.log(" onSavePatientOnly onSavePatientOnly ");
  }
  onSelectCancerFamId(e) {
    console.log(" cancerFamily onSelectCancerFamId ");

    this.child.current.onSelectCancerFamId();
  }

  onSaveCancerFamilyID() {
    console.log(" cancerFamily onSaveCancerFamilyID ");

    this.child.current.onSaveCancerFamilyID();
  }

  onCancerInfoPage() {
    console.log("onCancerInfoPage onCancerInfoPage ");

    this.child.current.onCancerInfoPage();
  }

  onSearchPatient() {
    console.log(" cancerFamily onSaveCancerFamilyID ");
    if (this.childInvidiualCmp instanceof Individual) {
      this.childInvidiualCmp.getPatientDetails();
    } else {
      this.wizardCmp.next();
    }
    //this.child.current.onSaveCancerFamilyID();
  }
  // When "Save to database" is clicked in the preview screen(Previewinfo.js) this method will be fired.
  onSubmit(e) {
    console.log("in Submit 1234 : " + e);

    if (this.state.isInPreviewScreen == true) {
      console.log("in Submit IF : ");

      this.savePatient(this.state.patientDataValue);
      // e.preventDefault();
    } else {
      this.postRequest();
      // const validation = this.validator.validate(this.state);
      // this.setState({ validation });
      // if (validation.isValid) {
      //     // this.submitted = true;
      //   // alert("All Valid ")
      //     console.log("Form Valid ")

      //     console.log("in Submit else : ")
      // }else{
      //     // this.submitted = false;

      //     console.log("Form NOT Valid ")

      // }
    }

    //  }
  }

  handleChangeAOD = e => {
    const val = e.target.value;
    // If the current value passes the validity test then apply that to state
    if (e.target.validity.valid) {
      this.setState({ currentaodeath: e.target.value });
    }
    // If the current val is just the negation sign, or it's been provided an empty string,
    // then apply that value to state - we still have to validate this input before processing
    // it to some other component or data structure, but it frees up our input the way a user
    // would expect to interact with this component
    else if (val === "" || val === "-") this.setState({ currentaodeath: val });
  };

  getYearsFromDate(d1, d2) {
    return Math.floor((d2 - d1) / 31536000000);
  }
  render() {
    // let validation = this.submitted ?                         // if the form has been submitted at least once
    //     this.validator.validate(this.state) :   // then check validity every time we render
    //     this.state.validation                   // otherwise just use what's in state

    const Error = ({ name }) => (
      <Field
        name={name}
        subscribe={{ touched: true, error: true }}
        render={({ meta: { touched, error } }) =>
          touched && error ? (
            <div className="inline-error">
              <ul>
                <li className="validationMsg">
                  <span>{error}</span>
                </li>
              </ul>
            </div>
          ) : null
        }
      />
    );
    // Formik : Passing the props
    // const {
    //     values,
    //     errors,
    //     touched,
    //     isSubmitting

    // } = this.props;

    const alignLeft0 = {
      paddingLeft: "0px"
    };
    return (
      // isModalOpenValue={this.state.isModalOpen}
      // <Wizard >
      //     <Wizard.Page>
      //         <Welcome />
      //     </Wizard.Page>
      //     <Wizard.Page>
      //         <ChoosePath onChooseOption={this.handleChooseOption}/>
      //     </Wizard.Page>
      //     <Wizard.Page>

      //         {this.choosePath()}

      //     </Wizard.Page>

      //  {/* onOpenDialog={this.setDialogState} */}
      // {/* <Wizard.Page>
      //     <CancerInfo onSaveChangeInfo={this.handleChangedRecFrmChild}/>
      // </Wizard.Page>
      // <Wizard.Page>
      //     <PreviewInfo  arrayEditedData= {this.state.arrayEditedData} isCancerEdited={this.state.isCancerEdited}/>
      // </Wizard.Page> */}
      <Wizard
        choosePathFamily={this.state.choosePathFamily}
        onSubmit={this.onSubmit.bind(this)}
        onSavePatientOnly={this.onSavePatientOnly.bind(this)}
        onSelectCancerFamId={this.onSelectCancerFamId.bind(this)}
        onSaveCancerFamilyID={this.onSaveCancerFamilyID.bind(this)}
        onCancerInfoPage={this.onCancerInfoPage.bind(this)}
        onSearchPatient={this.onSearchPatient.bind(this)}
        isChecked={this.state.isChecked}
        ref={wizardCmp => {
          this.wizardCmp = wizardCmp;
        }}
      >
        {/* <Wizard.Page>
          <Welcome /> 
        </Wizard.Page> */}
        {/* Page 0 */}
        <Wizard.Page>
          <ChoosePath onChooseOption={this.handleChooseOption} /> {/* Page 1 */}
        </Wizard.Page>
        <Wizard.Page>
          {this.choosePath()} {/* Page 2 */}
        </Wizard.Page>
        {/* Pages for the INDIVIDUAL flow START                 */}
        <Wizard.Page
          validate={values => {
            const errors = {};
            // specificComplaintcolumn:[]
            console.log(
              "in validation %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% 1111"
            );
            // if (this.state.currentDOB == '') {
            // alert("In error")
            if (
              this.state.selectedDateDOB != "" &&
              this.state.selectedMonthDOB != "" &&
              this.state.selectedYearDOB != ""
            ) {
              this.state.isValidBirthDateSelected = true;
              this.state.currentDOB = this.convertDateFormat(
                this.state.selectedYearDOB +
                  this.state.selectedMonthDOB +
                  this.state.selectedDateDOB
              );
              console.log("dob : " + this.state.selectedMonthDOB);
              console.log("dob : " + this.state.selectedDateDOB);
              console.log("dob : " + this.state.selectedYearDOB);
              console.log("dob : " + this.state.currentDOB);

              this.state.isValidBirthDateSelected = true;
              this.validateBirthDate(
                this.state.selectedDateDOB,
                this.state.selectedMonthDOB,
                this.state.selectedYearDOB,
                errors
              );
              // Send to the preview screen only  if the value has changed from the old dob
              // if(this.state.dateOFDOB!=this.state.currentDOB){
              this.setPreviewScreenData(
                "DOB",
                this.state.dateOFDOB,
                this.state.currentDOB
              );
              // }
            } else if (
              this.state.selectedDateDOB == "" &&
              this.state.selectedMonthDOB == "" &&
              this.state.selectedYearDOB == ""
            ) {
              this.state.isValidBirthDateSelected = false;
            } else if (
              this.state.selectedDateDOB != "" ||
              this.state.selectedMonthDOB != "" ||
              this.state.selectedYearDOB != ""
            ) {
              errors.currentdobColumn = "Please enter a valid date of birth";
              this.state.isValidBirthDateSelected = false;
            } else {
            }

            // if (this.state.currentLKDA == "") {

            // alert("In error")
            console.log("before dod : " + this.state.currentLKDA);
            console.log("before LKD : " + this.state.selectedMonthLKD);
            console.log("before LKD : " + this.state.selectedDateLKD);
            if (
              this.state.selectedDateLKD != "" &&
              this.state.selectedMonthLKD != "" &&
              this.state.selectedYearLKD != ""
            ) {
              this.state.currentLKDA = this.convertDateFormat(
                this.state.selectedYearLKD +
                  this.state.selectedMonthLKD +
                  this.state.selectedDateLKD
              );
              console.log("dod : " + this.state.currentLKDA);
              console.log("LKD : " + this.state.selectedMonthLKD);
              console.log("LKD : " + this.state.selectedDateLKD);
              console.log("LKD : " + this.state.selectedYearLKD);

              this.state.isValidLKDSelected = true;

              this.validateLKDDate(
                this.state.selectedDateLKD,
                this.state.selectedMonthLKD,
                this.state.selectedYearLKD,
                errors
              );

              if (
                this.state.currentCourseOfLiveDate == null ||
                this.state.currentCourseOfLiveDate == ""
              ) {
                errors.currentCourseOfLiveDate =
                  "Please specify source of live date";
              }
              this.setPreviewScreenData(
                "Live Date",
                this.state.dateOfLKDA,
                this.state.currentLKDA
              );
            } else if (
              this.state.selectedDateLKD == "" &&
              this.state.selectedMonthLKD == "" &&
              this.state.selectedYearLKD == ""
            ) {
              this.state.isValidLKDSelected = false;
            } else if (
              this.state.selectedDateLKD != "" ||
              this.state.selectedMonthLKD != "" ||
              this.state.selectedYearLKD != ""
            ) {
              this.state.isValidLKDSelected = false;
              errors.currentLkdColumn = "LKD Date is a required field";
            } else {
              this.state.isValidLKDSelected = false;
            }
            //end lkddate validation

            //start date of death validations

            if (
              this.state.selectedDate != "" &&
              this.state.selectedMonth != "" &&
              this.state.selectedYear != ""
            ) {
              this.state.currentDeath = this.convertDateFormat(
                this.state.selectedYear +
                  this.state.selectedMonth +
                  this.state.selectedDate
              );
              this.state.isValidDeathSelected = true;
              console.log("dod : " + this.state.currentDeath);
              console.log("dateOfLKDA : " + this.state.dateOfLKDA);

              // this.state.currentaodeath = this.getYearsFromDate(new Date(this.state.currentDeath), new Date(this.state.dateOFDOB))
              console.log("currentaodeath : " + this.state.currentaodeath);

              this.validateDeathDate(
                this.state.selectedDate,
                this.state.selectedMonth,
                this.state.selectedYear,
                errors
              );
            } else if (
              this.state.selectedDate == "" &&
              this.state.selectedMonth == "" &&
              this.state.selectedYear == ""
            ) {
              this.state.isValidDeathSelected = false;
            } else if (
              this.state.selectedDate != "" ||
              this.state.selectedMonth != "" ||
              this.state.selectedYear != ""
            ) {
              this.state.isValidDeathSelected = false;

              errors.currentdodColumn = "Please enter a valid date of death";
            }
            console.log("dod 2: " + this.state.currentLKDA);
            console.log("currentDeath 2: " + this.state.currentDeath);

            if (this.state.currentCourseOfLiveDate == "") {
              if (this.state.currentLKDA != "") {
                errors.sourceLKDColumn =
                  "Source of Last Known Date is a required field";
              }
            }
            if (this.state.currentSourceOFDeath == "") {
              if (this.state.currentaodeath != "") {
                errors.currentDeathSourceColumn =
                  "Source of Death is a required field";
              }
            }

            this.validateAgeOfDeath(errors);

            // }
            if (this.state.isAlive) {
              // this.state.uknCourseOFDeath =true;
            }

            console.log(" ERRORS " + errors);

            if (errors.length == 0) {
              console.log("NO ERRORS " + this.state.currentDOB);

              this.postRequest();
            }
            return errors;
          }}
        >
          <div>
            {" "}
            {/* Page 3 */}
            {/* <Wizard.Page> */}
            <div className="row">
              <HeaderPanel patientDetials={this.state.patientData} />
              {/* <div className="form-horizontal"> */}
              <div className="modal-body row">
                <div className="col-sm-12">
                  <div className="row">
                    {/* Existing Details Start */}
                    <div className="col-sm-6 existingDetails">
                      <div className="col-sm-12 panel-header-left control-margin">
                        Existing Details
                      </div>{" "}
                      <br />
                      <div className="col-sm-12 control-margin">Gender:</div>
                      <div className="col-sm-12 control-margin">
                        {/* <span>{this.state.gender}</span> */}
                        {/* <input type="text" name="genderOldColumn" value={this.state.gender} /><br /> */}
                        <span>{this.state.gender}</span>
                        {/* <input type="text" name="currentaodeathColumn" /> */}
                        {/* <div className="validationMsg"> */}
                        {/* <Error name="ageColumn" /> */}
                        {/* {touched.email && errors.email && <p>{errors.email}</p>} */}
                        {/* </div> */}
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">Date of Birth:</div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">{this.state.dateOFDOB}</span>
                      </div>{" "}
                      <br />
                      <div className="col-sm-12 control-margin">
                        Vital Status:
                      </div>
                      <div className="col-sm-12 control-margin">
                        <span className="spanText">{this.state.status}</span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">Date of Death:</div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.dateOfDeath}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">Age of Death:</div>
                      <div className="col-sm-12 margin15">
                        {/* <span><label className="form-check-label" name ="aodeathColumn"  >{values.aodeathColumn}</label></span> */}
                        <span className="spanText">{this.state.aodeath}</span>
                        {/* {this.state.aodeath} */}
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">
                        Source of Death Information:
                      </div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.sourceOFDeath.description}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">Cause of Death:</div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.courseOFDeath.description}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">Last Known Date:</div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.dateOfLKDA}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">
                        Source of Last Known Date:
                      </div>
                      <div className="col-sm-12 margin15">
                        {/* ToDo correct value  */}
                        <span className="spanText">
                          {this.state.sourceOfLiveDate.description}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">
                        EPI FUP 1 STATUS:
                      </div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.fPI1Status.description}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">
                        EPI FUP 2 STATUS:
                      </div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.fPI2Status.description}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">
                        EPI FUP 3 STATUS:
                      </div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.fPI3Status.description}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">
                        EPI FUP 4 STATUS:
                      </div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.fPI4Status.description}
                        </span>
                      </div>
                      <br />
                      <div className="col-sm-12 margin15">
                        Relationship Code:
                      </div>
                      <div className="col-sm-12 margin15">
                        <span className="spanText">
                          {this.state.relationshipCode.description}
                        </span>
                      </div>
                      <br />
                    </div>

                    {/* Existing Details End */}

                    {/* New Details Start*/}
                    <div className="col-sm-6">
                      <div className="col-sm-12 panel-header-left control-margin">
                        New Details
                      </div>
                      <br />
                      <div className="col-sm-12 control-margin">Gender:</div>
                      <div className="col-sm-12 marginMinus20">
                        <div
                          className="form-check form-check-inline "
                          onChange={this.setSex.bind(this)}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            value="1"
                            checked={
                              this.state.currentGender == 1 ? true : false
                            }
                            name="genderColumn"
                          />
                          <label className="form-check-label">Male</label>
                          <input
                            className="form-check-input"
                            type="radio"
                            value="2"
                            checked={
                              this.state.currentGender == 2 ? true : false
                            }
                            name="genderColumn"
                          />
                          <label className="form-check-label">Female</label>
                          <input
                            className="form-check-input"
                            type="radio"
                            value="3"
                            checked={
                              this.state.currentGender == 3 ? true : false
                            }
                            name="genderColumn"
                          />
                          <label className="form-check-label">Unknown</label>
                        </div>
                        <br />
                      </div>{" "}
                      <br />
                      <div className="col-sm-12 ">Date of Birth:</div>
                      <div className="col-sm-12 control-margin">
                        <DateSelect
                          isAlive={false}
                          value={this.state.currentDOB}
                          dateOfDiagFromDb={this.state.currentDOB}
                          name="currentdobColumn"
                          onSelectYear={this.handleYearPickedDOB}
                          onSelectMonth={this.handleMonthPickedDOB}
                          onSelectDate={this.handleDatePickedDOB}
                          onChange={this.createDate.bind(this)}
                        />
                        {/* <DatePicker
                                                    onChange={this.oncurrentDOBChange}
                                                    value={this.state.currentDOB}
                                                /> */}
                        <div className="validationMsg">
                          <Error name="currentdobColumn" />
                        </div>
                      </div>
                      <br />
                      <br />
                      <div className="col-sm-12 control-margin">
                        Vital Status:
                      </div>
                      <div
                        className="col-sm-12 control-margin"
                        value={this.state.currentStatus}
                      >
                        <div
                          className="form-check form-check-inline"
                          onChange={this.setCurrentStatus.bind(this)}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            value="1"
                            checked={
                              this.state.currentStatus == 1 ? true : false
                            }
                            name="vitalStatusColumn"
                          />
                          <label className="form-check-label">Alive</label>
                          <input
                            className="form-check-input"
                            type="radio"
                            value="2"
                            checked={
                              this.state.currentStatus == 2 ? true : false
                            }
                            name="vitalStatusColumn"
                          />
                          <label className="form-check-label">Dead</label>
                          <input
                            className="form-check-input"
                            type="radio"
                            value="3"
                            checked={
                              this.state.currentStatus == 3 ? true : false
                            }
                            name="vitalStatusColumn"
                          />
                          <label className="form-check-label">Unknown</label>
                        </div>
                      </div>
                      <br />
                      <div className="col-sm-12 ">Date of Death:</div>
                      <div className="col-sm-12 control-margin">
                        {/* <DatePicker disabled={this.state.isAlive}
                                                    onChange={this.setCurrentDateDeath}
                                                    value={this.state.currentDeath}
                                                /> */}
                        <DateSelect
                          isAlive={this.state.isAlive}
                          value={this.state.currentDeath}
                          name="currentdodColumn"
                          onSelectYear={this.handleYearPickedDod}
                          onSelectMonth={this.handleMonthPickedDod}
                          onSelectDate={this.handleDatePickedDod}
                          onChange={this.validateDeathDate.bind(this)}
                        />
                        <div className="validationMsg">
                          <Error name="currentdodColumn" />
                        </div>
                      </div>
                      <br />
                      <div className="col-sm-12 ">Age of Death:</div>
                      <div className="col-sm-12 control-margin">
                        {/* <span disabled={this.state.isAlive} name ="currentaodeathColumn" > </span> */}
                        <input
                          type="text"
                          value={this.state.currentaodeath}
                          name="currentaodeathColumn"
                          className="form-control"
                          pattern="^-?[0-9]\d*\.?\d*$"
                          disabled={
                            this.state.isAlive ||
                            this.state.isDODNotNull ||
                            this.state.isAgeCalculated
                          }
                          onChange={this.handleChangeAOD.bind(this)}
                        />
                        {/* // {this.state.currentaodeath}
                                                value={"values.currentaodeathColumn"} */}
                        {/* <label type="label" name ="currentaodeathColumn" value={values.currentaodeathColumn}></input> */}

                        <div className="validationMsg">
                          <Error name="currentaodeathColumn" />
                        </div>
                      </div>
                      <br />
                      <div className="col-sm-12 ">
                        Source of Death Information:
                      </div>
                      <div className="col-sm-12 control-margin control-margin">
                        <select
                          disabled={this.state.isAlive}
                          className="form-control "
                          value={this.state.currentSourceOFDeath}
                          onChange={this.setCurrentSource.bind(this)}
                          name="currentDeathSourceColumn"
                        >
                          <option>{"Choose One"}</option>
                          {this.state.srcOfDeathRest.map((read, i) => {
                            this.state.read = read.description;
                            // console.log("profession ID :  " + read.id);
                            return (
                              <option key={read.value} value={read.description}>
                                {read.description}
                              </option>
                            );
                          })}
                          {/* <option >{"Hospital Rec"}</option> */}}
                        </select>
                        <div className="validationMsg">
                          <Error name="currentDeathSourceColumn" />
                        </div>
                      </div>
                      <br />
                      <div className="form-check-inline col-sm-12 ">
                        <div className="col-sm-6">Cause of Death:</div>

                        {/* <div className="col-sm-1"></div> */}

                        <div className="col-sm-2">(Unknown)</div>
                      </div>
                      <div className="form-check-inline col-sm-12 control-margin">
                        <div className="col-sm-8">
                          <input
                            type="text"
                            name="currentCourseOFDeathColumn"
                            class="form-control"
                            value={this.state.currentCourseOFDeath}
                            disabled={
                              this.state.isAlive || this.state.uknCourseOFDeath
                            }
                            onChange={this.setCurrentCauseDeath.bind(this)}
                          />
                        </div>

                        {/* <div className="col-sm-1"></div> */}

                        <div className="col-sm-4">
                          <input
                            className="form-control"
                            type="checkbox"
                            value={this.state.uknCourseOFDeath}
                            name="unknownCourseOFDeathColumn"
                            disabled={this.state.isAlive}
                            onChange={this.setUnknownCauseDeath.bind(this)}
                          />
                        </div>
                      </div>
                      <br />
                      {/* <span>{this.state.currentCourseOFDeath}</span> */}
                      {/* checked={values.newsletter} */}
                      <div className="col-sm-12 ">Last Known Date:</div>
                      <div className="col-sm-12 margin15">
                        <DateSelect
                          isAlive={false}
                          value={this.state.currentLKDA}
                          name="currentLkdColumn"
                          onSelectYear={this.handleYearPickedLKD}
                          onSelectMonth={this.handleMonthPickedLKD}
                          onSelectDate={this.handleDatePickedLKD}
                          onChange={this.createDate.bind(this)}
                        />
                        {/* <DatePicker
                                                    onChange={this.setCurrentLKDA}
                                                    value={this.state.currentLKDA}
                                                /> */}
                        <div className="validationMsg">
                          <Error name="currentLkdColumn" />
                        </div>
                      </div>
                      <br />
                      <div className="col-sm-12 ">
                        Source of Last Known Date:
                      </div>
                      <div className="col-sm-12 margin15">
                        <select
                          className="form-control "
                          value={this.state.currentCourseOfLiveDate}
                          onChange={this.setSourceLKD.bind(this)}
                          name="sourceLKDColumn"
                        >
                          <option>{"Choose One"}</option>
                          {this.state.lastKnownDatesRest.map((ageGroup, i) => {
                            this.state.ageGroup = ageGroup.description;
                            // console.log("location ID :  " + ageGroup.id);
                            return (
                              <option
                                key={ageGroup.value}
                                value={ageGroup.description}
                              >
                                {ageGroup.description}
                              </option>
                            );
                          })

                          // <option >{"Hospital Rec"}</option>
                          }
                        </select>
                        <div className="validationMsg">
                          <Error name="sourceLKDColumn" />
                        </div>
                      </div>
                      <br />
                      <div className="col-sm-12 ">EPI FUP 1 STATUS:</div>
                      <div className="col-sm-12 margin15">
                        <select
                          className="form-control "
                          value={this.state.currentfPI1Status}
                          onChange={this.setcurrentfPI1Status.bind(this)}
                          name="fPI1StatusColumn"
                        >
                          <option>{"Choose One"}</option>
                          {this.state.fupcodesRest.map((read, i) => {
                            this.state.read = read.description;
                            // console.log("profession ID :  " + read.id);
                            return (
                              <option key={read.value} value={read.description}>
                                {read.description}
                              </option>
                            );
                          })}
                          {/* <option >{"Hospital Rec"}</option> */}}
                        </select>
                      </div>
                      <br />
                      <div className="col-sm-12 ">EPI FUP 2 STATUS:</div>
                      <div className="col-sm-12 margin15">
                        <select
                          className="form-control "
                          value={this.state.currentfPI2Status}
                          onChange={this.setcurrentfPI2Status.bind(this)}
                          name="fPI2StatusColumn"
                        >
                          <option>{"Choose One"}</option>
                          {this.state.fupcodesRest.map((read, i) => {
                            this.state.read = read.description;
                            // console.log("profession ID :  " + read.id);
                            return (
                              <option key={read.value} value={read.description}>
                                {read.description}
                              </option>
                            );
                          })}
                          {/* <option >{"Hospital Rec"}</option> */}}
                        </select>
                      </div>
                      <br />
                      <div className="col-sm-12 ">EPI FUP 3 STATUS:</div>
                      <div className="col-sm-12 margin15">
                        <select
                          className="form-control "
                          value={this.state.currentfPI3Status}
                          onChange={this.setcurrentfPI3Status.bind(this)}
                          name="fPI3StatusColumn"
                        >
                          <option>{"Choose One"}</option>
                          {this.state.fupcodesRest.map((read, i) => {
                            this.state.read = read.description;
                            // console.log("profession ID :  " + read.id);
                            return (
                              <option key={read.value} value={read.description}>
                                {read.description}
                              </option>
                            );
                          })}

                          {/* <option >{"Hospital Rec"}</option> */}
                        </select>
                      </div>
                      <br />
                      <div className="col-sm-12 ">EPI FUP 4 STATUS:</div>
                      <div className="col-sm-12 margin15">
                        <select
                          className="form-control "
                          value={this.state.currentfPI4Status}
                          onChange={this.setcurrentfPI4Status.bind(this)}
                          name="fPI4StatusColumn"
                        >
                          <option>{"Choose One"}</option>
                          {this.state.fupcodesRest.map((read, i) => {
                            this.state.read = read.description;
                            // console.log("profession ID 4:  " + read.id);
                            return (
                              <option key={read.value} value={read.description}>
                                {read.description}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <br />
                      <div className="col-sm-12 control-margin">
                        Relationship Code:
                      </div>
                      <div className="col-sm-12 control-margin">
                        <select
                          className="form-control "
                          value={this.state.currentRelationshipCode}
                          onChange={this.setcurrentRelationshipCode.bind(this)}
                          name="currentRelCodeColumn"
                        >
                          <option>{"Choose One"}</option>
                          {this.state.relcodesRest.map((read, i) => {
                            this.state.read = read.name;
                            // console.log("location ID :  " + read.id);
                            return (
                              <option key={read.value} value={read.description}>
                                {read.description}
                              </option>
                            );
                          })

                          // <option >{"Hospital Rec"}</option>
                          }
                        </select>
                      </div>
                      <br />
                      <br />
                      <div className="col-sm-12" />
                    </div>
                    {/* current Details End*/}
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </Wizard.Page>
        <Wizard.Page>
          {this.state.secoundPage} {/* Page 4 -- Dialog page CancerInfo.js*/}
          {/* <CancerInfo onSaveChangeInfo={this.handleChangedRecFrmChild} arrayEditedData= {this.state.arrayEditedData}/> */}
        </Wizard.Page>
        <Wizard.Page>
          {this.state.thirdPage} {/* Page 5 -- [INDIVIDUAL] Preview Page */}
        </Wizard.Page>
        <Wizard.Page>
          {this.state.IndividualFinish} {/* Page 6 [INDIVIDUAL] SUCCESS */}
        </Wizard.Page>
        {/* Pages for the INDIVIDUAL flow END                 */}
        {/* Pages for the Family flow START                 */}
        <Wizard.Page>
          <div>
            {this.state.sixthPage} {/* Page 7 */}
          </div>
        </Wizard.Page>
        <Wizard.Page>
          <div>
            <FamilySaveInfo
              chkBoxId={this.state.chkBoxId}
              selectedSrlCode={this.state.selectedSrlCode}
              currentLKD={this.state.currentLKD}
              ref={this.child}
            />{" "}
            {/* Page 8 */}
          </div>
        </Wizard.Page>
        {/* Pages for the Family flow END                 */}
        <Wizard.Page>
          {/* <div>Last </div> */}
          <FamilyFinish />
        </Wizard.Page>
      </Wizard>
      // </Wizard.Page>
      // <Wizard.Page>
      //     <CancerInfo onSaveChangeInfo={this.handleChangedRecFrmChild}/>
      // </Wizard.Page>
      // <Wizard.Page>
      //     <PreviewInfo  arrayEditedData= {this.state.arrayEditedData} isCancerEdited={this.state.isCancerEdited}/>
      // </Wizard.Page>
      //     {/* <BootstrapDialogOld/> */}
      // {/* <BootstrapDialog/> */}
      // </Wizard>
    );
  }
}
const FormikApp = withFormik({
  mapPropsToValues({ email, aodeathColumn, currentaodeathColumn }) {
    return {
      email: "",
      // aodeathColumn:'fromDb',
      currentaodeathColumn: "testin",
      vitalStatusColumn: 1
    };
  },
  handleSubmit() {
    console.log("CancerFamilyReg SUBMIT ");
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("Email not valid")
      .required("Email is required")
    // password: Yup.string().min(9, 'Password must be 9 characters or longer').required('Password is required')
  })
})(CancerFamilyReg);

export default FormikApp;
{
  /* <DropdownMenu
      trigger="Choices"
      triggerType="button"
      shouldFlip={false}
      position="right middle"
      onOpenChange={this.setcurrentRelationshipCode.bind(this)}
    >         <DropdownItemGroup>
    <DropdownItem>Sydney</DropdownItem>
    <DropdownItem>Melbourne</DropdownItem>
  </DropdownItemGroup>
</DropdownMenu> */
}
{
  /* <div style={{ margin: '20px' }}> */
}
// ReactDOM.render(template, document.getElementById("app"));

// Page 1 Functions
//getFromDB(),assignDbDataToFields(), postRequest()
// Page 2 Functions
//
