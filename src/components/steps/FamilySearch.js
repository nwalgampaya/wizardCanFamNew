import React from "react";
import ReactDOM from "react-dom";
import Autocomplete from "react-autocomplete";
import { properties } from "../../properties.js";
import DatePicker from "react-date-picker";
import Store from "./FamilyStore";
import { FamilyStateObj } from "./Family";
import Loader from "react-loader-spinner";
import LoadingOverlay from "react-loading-overlay";
import { css } from "@emotion/core";
import { RingLoader } from "react-spinners";
// Another way to import
// import ClipLoader from "react-spinners/ClipLoader";

export default class FamilySearch extends React.Component {
  constructor(props) {
    super(props);

    (this._id = FamilySearch.incrementId()),
      (this.state = {
        value: "",
        familyData: [],
        individualId: [],
        currentLKD: "",
        sendCurrentLKD: "",
        isSearched: false,
        srlcodesRest: [],
        selectedSrlCode: "",
        familyIdValue: "",
        checkboxObj: {
          lkdDate: "",
          patientIDs: ""
        },
        chkBoxId: [],
        apierror: { debugMessage: "", status: "", timestamp: "", message: "" },
        error: false,
        errorMsg: "",
        isChecked: [],
        isCheckedSingle: false,
        isCheckedAll: false,
        isLoading: false
        // { id:'',
        //   value:'',

        // },
      });

    this.handleLkd = this.handleLkd.bind(this);
    this.handleSearchGetFamily = this.handleSearchGetFamily.bind(this);
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

  handleLkd(currentLKD) {
    console.log("handleLkd :" + currentLKD);
    this.setState({
      currentLKD: currentLKD
    });

    this.state.sendCurrentLKD = this.convertDate(currentLKD);

    console.log(
      "currentDOB : ddddddddddddddddddddddd : " + this.state.sendCurrentLKD
    );
  }

  componentWillUnmount() {
    // var reloading = sessionStorage.getItem("reloading");
    // if (reloading) {
    //   Store.clearProductList();
    // } else {
    //   FamilyStateObj.isSearched = this.state.isSearched;
    //   FamilyStateObj.individualId = this.state.individualId;
    //   FamilyStateObj.checkboxObj = this.state.checkboxObj;
    //   FamilyStateObj.chkBoxId = this.state.chkBoxId;
    //   FamilyStateObj.familyId = this.state.familyIdValue;
    //   FamilyStateObj.selectedSrlCode = this.state.selectedSrlCode;
    //   FamilyStateObj.currentLKD = this.state.currentLKD;
    //   FamilyStateObj.isChecked = this.state.isChecked;
    //   FamilyStateObj.isCheckedAll = this.state.isCheckedAll;
    //   FamilyStateObj.sendCurrentLKD = this.state.sendCurrentLKD;
    //   Store.saveProductList(FamilyStateObj);
    // }
  }

  componentDidMount() {
    var state = Store.geFamilySearchState();
    if (state !== undefined && state.isSearched !== undefined) {
      this.state.isSearched = state.isSearched;
      this.state.individualId = state.individualId;
      this.state.checkboxObj = state.checkboxObj;
      this.state.chkBoxId = state.chkBoxId;
      this.state.familyIdValue = state.familyId;
      this.state.selectedSrlCode = state.selectedSrlCode;
      this.state.currentLKD = state.currentLKD;
      this.state.isChecked = state.isChecked;
      this.state.isCheckedAll = state.isCheckedAll;
      this.state.sendCurrentLKD = state.sendCurrentLKD;
    }

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

    const urlsrlcodes = properties.baseUrl + "srlcodes/";

    fetch(urlsrlcodes)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        this.setState({
          srlcodesRest: data
        });
        // this.state.IndividualData = data;
        // console.log("data :" + data);
      })
      .catch(error => {
        console.log("Error :");

        document.write("Error : " + error);
      });
  }

  setfamilyId(event) {
    console.log("Sex :" + event.target.value);
    // this.setState
    this.setState({
      familyId: event.target.value
    });
  }

  showSearchTabHeader() {
    if (!this.state.isLoading) {
      if (this.state.isSearched == true) {
        if (this.state.individualId.length > 0) {
          return (
            <tr>
              <th> {this.showSelectAllChkBx()} </th>
              <th> Individual ID</th>
              <th> LKD Date</th>
            </tr>
          );
        } else {
          return (
            <tr>
              <th>
                {" "}
                There are no living/eligible participants in this family to
                update Last Known Date. Please update these participants
                individually.
              </th>
            </tr>
          );
        }
      }
    }
  }
  showSelectAllChkBx() {
    const paddingLft = { paddingLeft: "10px" };
    if (!this.state.isLoading) {
      if (this.state.isSearched == true) {
        return (
          <div className="form-check form-check-inline chkScale">
            {/* <tr> */}
            <input
              checked={this.state.isCheckedAll}
              className="form-check-input"
              type="checkbox"
              // id={i}
              // id={value.patientIDs}
              // value={value.lkdDate}
              name="selectAllChkbx"
              onChange={this.setAllCheckBoxValues.bind(this)}
            />
          </div>
        );
      }
    }
  }
  showFamilyId() {
    console.log("In showFamily");

    if (this.state.isSearched == true) {
      return this.state.individualId.map((value, i) => (
        <tr key={i}>
          {/* value={this.state.chkBoxId} */}
          {/* {i+","+value} */}
          <td>
            <input
              checked={this.state.isChecked[i]}
              className="form-check-input"
              type="checkbox"
              // id={i}
              id={value.patientIDs}
              value={value.lkdDate}
              name={"individualChkbx"}
              onChange={this.setCheckBoxValues.bind(this)}
            />
          </td>

          {/* <td><input onChange={this.setfamilyId.bind(this)} value={i} type="radio" name="familyId"/></td> */}
          <td>{value.patientIDs}</td>
          <td>{this.convertDateFormat(value.lkdDate)}</td>
        </tr>
      ));
    }
  }

  setReset = () => {
    this.setState(
      {
        individualId: [],
        isChecked: [],
        isSearched: false,
        isCheckedAll: false,
        isCheckedSingle: false,
        chkBoxId: [],
        familyIdValue: "",
        lkdDate: null,
        currentLKD: null,
        selectedSrlCode: ""
      },
      () => {
        this.onSelectCheckBox();
      }
    );
  };

  setAllCheckBoxValues(event) {
    console.log("is chek : " + event.target.checked);
    var checked = new Array();
    this.state.chkBoxId = new Array();
    if (event.target.checked) {
      this.state.individualId.map((value, i) => {
        this.state.checkboxObj = new Object();
        checked[i] = true;
        //var elem = document.getElementById(value.patientIDs);
        //elem.checked = event.target.checked;

        this.state.checkboxObj.lkdDate = value.lkdDate;
        this.state.checkboxObj.patientIDs = value.patientIDs;

        this.state.chkBoxId.push(this.state.checkboxObj);
        this.setState(
          {
            isCheckedAll: event.target.checked,
            isChecked: checked,
            isCheckedSingle: true
          },
          () => {
            this.onSelectCheckBox();
          }
        );
      });
    } else {
      this.state.individualId.map((value, i) => {
        checked[i] = false;
        // var elem = document.getElementById(value.patientIDs);
        // elem.checked = event.target.checked;

        this.setState(
          {
            isCheckedAll: event.target.checked,
            isChecked: checked,
            isCheckedSingle: false
          },
          () => {
            this.onSelectCheckBox();
          }
        );
      });
    }
  }
  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
  setCheckBoxValues(event) {
    this.state.checkboxObj = new Object();
    var checked = this.state.isChecked;

    // Get all the checked values into an array
    if (event.target.checked) {
      this.state.checkboxObj.lkdDate = event.target.value;
      this.state.checkboxObj.patientIDs = event.target.id;
      this.state.individualId.map((value, i) => {
        if (value.patientIDs == event.target.id) {
          checked[i] = true;
        }
      });

      this.state.chkBoxId.push(this.state.checkboxObj);

      if (event.target.value != null) {
        this.setState(
          {
            isCheckedSingle: true,
            isChecked: checked
          },
          () => {
            this.onSelectCheckBox();
          }
        );

        // this.state.isChked=true;
      }
      if (this.state.chkBoxId.length == this.state.individualId.length) {
        this.setState({
          isCheckedAll: true
        });
      }
    } else {
      var localChkBox = [];

      for (var i = 0; i < this.state.chkBoxId.length; i++) {
        if (this.state.chkBoxId[i].patientIDs === event.target.id) {
          localChkBox = this.state.chkBoxId.splice(i, 1);
        }
      }

      this.state.individualId.map((value, i) => {
        if (value.patientIDs == event.target.id) {
          checked[i] = false;
        }
      });
      this.setState({
        isCheckedAll: false,
        chkBoxId: localChkBox,
        isChecked: checked
        // isChecked: event.target.checked
      });
    }
    if (this.state.chkBoxId.length == 0) {
      this.state.isCheckedSingle = false;
      this.onSelectCheckBox();
    }
    this.setState({
      chkBoxId: this.state.chkBoxId
    });
  }
  setFamilyValue = value => {
    this.setState({
      familyIdValue: value
    });
  };

  setErrorFalse() {
    this.setState({ error: false });
  }
  setErrortrue() {
    this.setState({ error: true });
  }

  convertDate(str) {
    console.log("ddddddddddddddddddddddd" + str);
    var str2 = "" + str;
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

    return [date[3], mnths[date[1]], date[2]].join("");
  }

  handleSearchGetFamily() {
    this.state.isLoading = true;
    console.log("individualId : " + this.state.value);
    // var lkdDate = "20000204"
    var lkdDate = this.state.sendCurrentLKD;

    var familyIdValue = this.state.familyIdValue;
    const urlIndividualId =
      // properties.baseUrl + "patients/family/" + familyIdValue;
      properties.baseUrl +
      "/patients/familyId/" +
      familyIdValue +
      "?lkd=" +
      lkdDate;

    let status;

    // this.setState(
    //   { selectedYear: selectedYear != "Year" ? selectedYear : "" },
    //   () => this.onChangeDeathDate()
    // );
    this.setState(
      {
        individualId: [],
        isLoading: true,
        isChecked: [],
        isCheckedAll: false,
        isCheckedSingle: false,
        chkBoxId: []
      },
      () =>
        fetch(urlIndividualId)
          .then(response => {
            status = response.status;
            return response.json();
          })
          .then(data => {
            if (status == 200) {
              console.log(data);
              this.setErrorFalse();
              this.setState({
                individualId: data
              });

              this.setState({ isSearched: true });

              this.state.individualId.map((value, i) => {
                console.log("individual : " + value.patientIDs);
                // console.log("individual : " + value[i].patientIDs);
              });
            } else if (status == 404) {
              console.log(data);
              this.setState({ isSearched: false });
              this.state.errorMsg = "Invalid Family ID";
              // data.apierror.message;
              this.setErrortrue();
              //   this.setState({
              //     errorMsg: data.api(error.message
              //   });
            }

            this.setState({ isLoading: false });
          })
          .catch(error => {
            console.log("Error :");

            document.write("Error : " + error);
          })
    );
    console.log("data : " + this.state.individualId);
    this.state.isSearched = true;
  }

  setSrlcodes(event) {
    console.log("Srlcode :" + event.target.value);
    // this.setState
    this.setState({
      selectedSrlCode: event.target.value
    });
  }

  onSelectCheckBox() {
    this.props.onProceedButton(this.state.isCheckedSingle);
  }

  onSelectCancerFamId(e) {
    console.log(" onSelectCancerFamId onSelectCancerFamId ");

    FamilyStateObj.isSearched = this.state.isSearched;
    FamilyStateObj.individualId = this.state.individualId;
    FamilyStateObj.checkboxObj = this.state.checkboxObj;
    FamilyStateObj.chkBoxId = this.state.chkBoxId;
    FamilyStateObj.familyId = this.state.familyIdValue;
    FamilyStateObj.selectedSrlCode = this.state.selectedSrlCode;
    FamilyStateObj.currentLKD = this.state.currentLKD;
    FamilyStateObj.isChecked = this.state.isChecked;
    FamilyStateObj.isCheckedAll = this.state.isCheckedAll;
    FamilyStateObj.sendCurrentLKD = this.state.sendCurrentLKD;
    Store.saveFamilySearchState(FamilyStateObj);
    this.props.onFamilySearch(
      this.state.chkBoxId,
      this.state.selectedSrlCode,
      this.state.sendCurrentLKD
    );
  }

  handleSubmit() {
    console.log("In submit");
    const urlFamilyLkd =
      properties.baseUrl +
      "patients/family/" +
      this.state.value +
      "?lkd=" +
      this.state.sendCurrentLKD;

    fetch(urlFamilyLkd)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.setState({
          familyLkd: data
        });
        // this.state.IndividualData = data;
        console.log("data :" + this.state.familyLkd);
      })
      .catch(error => {
        console.log("Error :");

        document.write("Error : " + error);
      });
  }

  onSavePatientOnly() {
    console.log("onSavePatientOnly in family component");
  }

  LoadingIndicator(isLoading) {
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: red;
    `;

    return (
      <LoadingOverlay
        active={isLoading}
        spinner={
          <RingLoader
            css={override}
            sizeUnit={"px"}
            size={100}
            color={"#123abc"}
          />
        }
        text="Loading Individuals..."
      />
    );
  }

  setFamilyIDChanged = e => {
    this.setState({
      familyIdValue: e.target.value
    });
  };

  render() {
    const userDiv = {
      marginTop: "5px",
      marginBottom: "10px",
      textAlign: "right",
      width: "100%",
      display: "flex",
      marginRight: "5px"
    };

    const passDiv = {
      marginTop: "10px",
      textAlign: "right",
      width: "100%",
      display: "flex"
    };
    const loginDiv = {
      marginBottom: "20px",
      textAlign: "left"
    };

    const buttonDiv = {
      marginRight: "5px"
    };

    const h3Align = {
      textAlign: "center",
      marginLeft: "40%"
    };
    var errorDiv = {
      display: this.state.error ? "block" : "none",
      // marginLeft: "40px",
      textAlign: "center",
      marginBottom: "5px",
      width: "100%"
    };
    const leftMargin = {
      marginLeft: "15px",
      // marginLeft: "40%"
      marginRight: "15px",
      backgroundColor: "#f9f6f1",
      height: "100px"
    };
    const comboStyle = {
      marginBottom: "14px"
      // backgroundColor: "white"
    };
    var fontcolor = {
      color: "black",
      fontSize: "16px"
    };
    var controlMargin = {
      marginTop: "10px",
      marginBottom: "8px"
    };
    var controlMarginLKD = {
      marginTop: "10px",
      marginBottom: "8px",
      marginLeft: "20px"
    };
    return (
      <div>
        <p style={fontcolor}>
          Please enter the Family ID that you would like to update{" "}
        </p>
        <div className="row" style={leftMargin}>
          <div className="col-sm-4">
            <div className="col-sm-12  lableBold" style={controlMargin}>
              Family ID:
            </div>
            <div className="col-sm-12 control-margin">
              <Autocomplete
                wrapperStyle={{ width: "100%" }}
                inputProps={{
                  style: {
                    width: "100%",
                    height: "42px",
                    border: "1px solid #e6e6e6",
                    padding: "0 35px 0 19px",
                    // color: "#999",
                    bordeRadius: "4px"
                  },
                  placeholder: "Enter Family ID"
                }}
                wrapperStyle={{ width: "100%" }}
                className="form-control"
                items={this.state.familyData}
                shouldItemRender={(item, value) => item.indexOf(value) > -1}
                getItemValue={item => item}
                renderMenu={(items, value, style) => {
                  return (
                    <div
                      style={{
                        zIndex: "1",
                        backgroundColor: "f0eeec",
                        cursor: "pointer",
                        minWidth: "302.5px",
                        borderRadius: "3px",
                        boxShadow: " rgba(0, 0, 0, 0.1) 0px 2px 12px",
                        background: "rgba(255, 255, 255, 0.9)",
                        padding: "2px 0px; font-size: 90%",
                        position: "fixed",
                        overflow: "auto"
                        // maxHeight: "50%"
                      }}
                      children={items}
                    />
                  );
                }}
                renderItem={(item, isHighlighted) => (
                  <div
                    key={item}
                    style={{
                      background: isHighlighted ? "#f5f5f5" : "white"
                    }}
                  >
                    {item}
                  </div>
                )}
                value={this.state.familyIdValue}
                //   onChange={this.setFamilyValue.bind(this)}
                onChange={this.setFamilyIDChanged.bind(this)}
                onSelect={this.setFamilyValue.bind(this)}
                // onSelect={familyIdValue => this.setState({ familyIdValue })}
                //   on
              />
            </div>
          </div>

          <div className="col-sm-4 ">
            <div className="col-sm-12 lableBold" style={controlMargin}>
              Source:
            </div>

            <div className="col-sm-12" style={comboStyle}>
              <select
                style={{ backgroundColor: "white", color: "rgb(23, 54, 93)" }}
                className="form-control "
                // style={{ color: "#eee" }}
                value={this.state.selectedSrlCode}
                onChange={this.setSrlcodes.bind(this)}
                name="srlCodesColumn"
              >
                <option>{"Choose One"}</option>
                {this.state.srlcodesRest.map((read, i) => {
                  this.state.read = read.description;
                  // console.log("profession ID :  " + read.id);
                  return (
                    <option key={read.id} value={read.code}>
                      {read.description}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-sm-4 ">
            <div className="col-sm-12 lableBold" style={controlMarginLKD}>
              LKD Date:
            </div>
            <div
              className="col-sm-12 control-margin"
              style={{ marginBottom: "18px" }}
            >
              <DatePicker
                onChange={this.handleLkd}
                value={this.state.currentLKD}
                maxDate={new Date()}
                placeholderText="Select Date"
                className="form-control-date"
                style={{ backgroundColor: "rgb(23, 54, 93)" }}
              />
            </div>
          </div>
        </div>
        <div className="inline-error" style={errorDiv}>
          <ul>
            <li className="validationMsg">{this.state.errorMsg}</li>
          </ul>
        </div>
        {/* disabled={this.state.sendCurrentLKD =='' && this.state.familyIdValue =='' &&  this.state.selectedSrlCode ==''} */}
        <div className="form-group" style={userDiv}>
          <div className="col-sm-5 control-margin" />
          <div className="col-sm-4  control-margin" style={loginDiv}>
            <button
              className="btn btn-primary"
              style={buttonDiv}
              disabled={
                this.state.sendCurrentLKD == "" ||
                this.state.familyIdValue == "" ||
                this.state.selectedSrlCode == ""
              }
              type="button"
              onClick={this.handleSearchGetFamily}
            >
              Search
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.setReset}
            >
              {" "}
              Reset
            </button>
          </div>
        </div>
        {this.LoadingIndicator(this.state.isLoading)}
        <table className="TFtable">
          <tbody>
            {this.showSearchTabHeader()}
            {/* <input
              checked={this.state.isCheckedAll}
              className="form-check-input"
              type="checkbox"
              // id={i}
              // id={value.patientIDs}
              // value={value.lkdDate}
              name="selectAllChkbx"
              onChange={this.setAllCheckBoxValues.bind(this)}
            /> */}

            {this.showFamilyId()}
          </tbody>
        </table>
      </div>
    );
  }
}
