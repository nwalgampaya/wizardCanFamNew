import React from "react";
import ReactDOM from "react-dom";
import Autocomplete from "react-autocomplete";
import { properties } from "../../properties.js";
import DatePicker from "react-date-picker";

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
        isChecked: false,
        isCheckedAll: false
        // { id:'',
        //   value:'',

        // },
      });
    this.handleLkd = this.handleLkd.bind(this);
    this.handleSearchGetFamily = this.handleSearchGetFamily.bind(this);
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
  // convert(str) {
  //   console.log("ddddddddddddddddddddddd" + str);
  //   var str2 = "" + str;

  //   // var mnth = str2.slice(4,7)
  //   // var date = str2.slice(9,10)
  //   // var year = str2.slice(12,15)

  //   // console.log("Mnt" + mnth)
  //   var mnths = {
  //     Jan: "01",
  //     Feb: "02",
  //     Mar: "03",
  //     Apr: "04",
  //     May: "05",
  //     Jun: "06",
  //     Jul: "07",
  //     Aug: "08",
  //     Sep: "09",
  //     Oct: "10",
  //     Nov: "11",
  //     Dec: "12"
  //   },
  //     date = str2.split(" ");

  //   // console.log("date new 1" + date[1])
  //   // console.log("date new 2" + date[2])
  //   // console.log("date new 3" + date[3])
  //   // return [ date[3], mnths[date[1]], date[2] ].join("-");
  //   return [date[3], mnths[date[1]], date[2]].join("");
  // }

  componentDidMount() {
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
    if (this.state.isSearched == true) {
      return (
        <tr>
          <th> {this.showSelectAllChkBx()} </th>
          <th> Individual ID</th>
          <th> LKD Date</th>
        </tr>
      );
    }
  }
  showSelectAllChkBx() {
    const paddingLft = { paddingLeft: "10px" };
    if (this.state.isSearched == true) {
      return (
        <div className="form-check form-check-inline">
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
          <nbsp />
          <label style={paddingLft}>Select All</label>
          {/* </tr> */}
        </div>
      );
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
          <td>{value.lkdDate}</td>
        </tr>
      ));
    }
  }

  setAllCheckBoxValues(event) {
    console.log("is chek : " + event.target.checked);
    this.state.chkBoxId = new Array();
    this.setState(
      {
        isCheckedAll: event.target.checked,
        isChecked: event.target.checked
      },
      () => {
        this.onSelectCheckBox();
      }
    );

    this.state.individualId.map((value, i) => {
      this.state.checkboxObj = new Object();
      console.log("eeeeeeee" + i);
      console.log("eeeeeeee" + value.patientIDs);

      var elem = document.getElementById(value.patientIDs);
      elem.checked = event.target.checked;
      console.log("is chek : " + value.id);
      this.state.checkboxObj.lkdDate = value.lkdDate;
      this.state.checkboxObj.patientIDs = value.patientIDs;

      if (event.target.checked) {
        this.state.chkBoxId.push(this.state.checkboxObj);
        // } else {
        //   this.setState({
        // chkBoxId: []
        //   });
      }

      // this.setState(
      //   {
      //     isChecked: true
      //   }
      // );
      // this.state.checkboxObj[i].checked = event.target.checked;
    });
    // this.state.isChecked.id[1] = event.target.checked;
  }
  static incrementId() {
    if (!this.latestId) this.latestId = 1;
    else this.latestId++;
    return this.latestId;
  }
  setCheckBoxValues(event) {
    this.state.checkboxObj = new Object();
    console.log("chkBoxId id:" + event.target.value);
    console.log("chkBoxId key:" + event.target.key);
    console.log("chkBoxId id:" + event.target.id);
    console.log("chkBoxId checked:" + event.target.checked);

    // Get all the checked values into an array
    if (event.target.checked) {
      this.state.checkboxObj.lkdDate = event.target.value;
      this.state.checkboxObj.patientIDs = event.target.id;

      this.state.chkBoxId.push(this.state.checkboxObj);

      if (event.target.value != null) {
        this.setState(
          {
            isChecked: event.target.checked
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
      console.log(
        "*************** setCheckBoxValues ********" + event.target.id
      );
      console.log(
        "*************** setCheckBoxValues ********" +
          this.state.chkBoxId.indexOf(event.target.id)
      );

      for (var i = 0; i < this.state.chkBoxId.length; i++) {
        console.log(
          "*************** setCheckBoxValues ********" +
            this.state.chkBoxId[i].patientIDs
        );
        if (this.state.chkBoxId[i].patientIDs === event.target.id) {
          console.log(
            "*************** setCheckBoxValues ********" +
              this.state.chkBoxId[i].patientIDs
          );

          // arr.splice(i, 1);
          // this.state.chkBoxId.splice(this.state.chkBoxId.indexOf(event.target.id), 1);

          localChkBox = this.state.chkBoxId.splice(i, 1);
          // this.setState({
          //   // isCheckedAll: false,
          //   chkBoxId: this.state.chkBoxId.splice(i, 1)
          //   // chkBoxId: this.state.chkBoxId
          //   // isChecked: event.target.checked
          // })
        }
      }
      this.setState({
        isCheckedAll: false,
        chkBoxId: localChkBox
        // isChecked: event.target.checked
      });
    }
    if (this.state.chkBoxId.length == 0) {
      this.state.isChecked = false;
      this.onSelectCheckBox();
    }
    this.setState({
      chkBoxId: this.state.chkBoxId
    });

    for (var key in this.state.chkBoxId) {
      if (this.state.chkBoxId.hasOwnProperty(key)) {
        console.log(key, this.state.chkBoxId[key].lkdDate);
        console.log(key, this.state.chkBoxId[key].patientIDs);
      }
    }

    //ToDo remove this code
    this.state.chkBoxId.map((value, i) => {
      console.log("Selected chkbx values : " + value[i]);
    });
  }
  setFamilyValue(value) {
    console.log("family Id :" + value);
    this.setState({
      familyIdValue: value
    });
  }
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
          this.state.isSearched = true;

          this.state.individualId.map((value, i) => {
            console.log("individual : " + value.patientIDs);
            // console.log("individual : " + value[i].patientIDs);
          });
        } else if (status == 404) {
          console.log(data);
          this.state.errorMsg = "Patient not found for family " + familyIdValue;
          // data.apierror.message;
          this.setErrortrue();
          //   this.setState({
          //     errorMsg: data.api(error.message
          //   });
        }
      })
      .catch(error => {
        console.log("Error :");

        document.write("Error : " + error);
      });
    console.log("data : " + this.state.individualId);
    this.state.isSearched = true;

    this.state.individualId.map((value, i) => {
      console.log("individual : " + value);
    });
  }

  setSrlcodes(event) {
    console.log("Srlcode :" + event.target.value);
    // this.setState
    this.setState({
      selectedSrlCode: event.target.value
    });
  }

  onSelectCheckBox() {
    this.props.onProceedButton(this.state.isChecked);
  }

  onSelectCancerFamId(e) {
    console.log(" onSelectCancerFamId onSelectCancerFamId ");
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
      marginLeft: "25px",
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
      marginRight: "15px"
    };
    const comboStyle = {
      marginBottom: "14px",
      backgroundColor: "white"
    };
    return (
      <div>
        <div className="box headerPanel1">
          {/* <div className="headerPanel1Div"> */}
          <h3 style={h3Align}>Family Search</h3>
        </div>
        {/* </div> */}
        <p>Please enter the Family ID that you would like to update: </p>

        <div className="row" style={leftMargin}>
          <div className="col-sm-4" style={{ backgroundColor: "#f9f6f1" }}>
            <div
              className="col-sm-12 control-margin"
              style={{ marginBottom: "14px" }}
            >
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
                    color: "#999",
                    bordeRadius: "4px"
                  },
                  placeholder: "Enter Family ID"
                }}
                wrapperStyle={{ width: "100%" }}
                className="form-control"
                items={this.state.familyData}
                shouldItemRender={(item, value) => item.indexOf(value) > -1}
                getItemValue={item => item}
                renderItem={(item, highlighted) => (
                  <div
                    key={item}
                    style={{
                      backgroundColor: highlighted ? "#eee" : "transparent"
                    }}
                  >
                    {item}
                  </div>
                )}
                value={this.state.familyIdValue}
                //   onChange={this.setFamilyValue.bind(this)}
                onChange={e => this.setState({ familyIdValue: e.target.value })}
                onSelect={this.setFamilyValue.bind(this)}
                // onSelect={familyIdValue => this.setState({ familyIdValue })}
                //   on
              />
            </div>
          </div>

          <div className="col-sm-4 " style={{ backgroundColor: "#f9f6f1" }}>
            <div className="col-sm-12 control-margin">Source:</div>

            <div className="col-sm-12" style={comboStyle}>
              <select
                className="form-control "
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

          <div className="col-sm-4 " style={{ backgroundColor: "#f9f6f1" }}>
            <div
              className="col-sm-12 control-margin"
              style={{ backgroundColor: "#f9f6f1" }}
            >
              LKD Date:
            </div>
            <div
              className="col-sm-12 control-margin"
              style={{ marginBottom: "18px" }}
            >
              <DatePicker
                onChange={this.handleLkd}
                value={this.state.currentLKD}
              />
            </div>
          </div>
        </div>
        <div className="inline-error" style={errorDiv}>
          <ul>
            <li className="validationMsg">{this.state.errorMsg}</li>
          </ul>
        </div>
        <br />
        <br />
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
            <button className="btn btn-primary" type="button">
              {" "}
              Reset
            </button>
          </div>
        </div>
        {/* {this.showSelectAllChkBx()} */}
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
