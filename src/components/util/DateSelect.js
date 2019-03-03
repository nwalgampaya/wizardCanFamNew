import React from "react";
// import React, { Component } from 'react';
import "../../App.css";

export default class DateSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dateArray: [],
      monthArray: [],
      yearArray: [],
      selectedMonth: "",
      selectedDate: "",
      selectedYear: "",

      selectedEditMonth: "",
      selectedEditDate: "",
      selectedEditYear: "",

      dateOfDiagFromDb: ""
    };
    // this.setDate = this.setDate.bind(this);
  }

  setDate(event) {
    console.log("date Value" + event.target.value);
    this.setState({
      selectedDate: event.target.value
    });

    this.props.onSelectDate(event.target.value);
  }

  setMonth(event) {
    console.log("selectedMonth Value" + event.target.value);
    this.setState({
      selectedMonth: event.target.value
    });
    this.props.onSelectMonth(event.target.value);
  }
  setYear(event) {
    console.log("selectedYear Value" + event.target.value);
    this.setState({
      selectedYear: event.target.value
    });
    this.props.onSelectYear(event.target.value);
  }

  convertDateToString(date) {
    var date = date;
    // "03/22/2004"
    // 03222004
    console.log(" convertDateToString " + date);
    date = date.replace("/", "");
    console.log(" convertDateToString " + date);
    date = date.substr(5, 4) + date.substr(0, 4);
    console.log(" convertDateToString : " + date);
    return date;
  }
  componentWillMount() {
    this.getDateArray();
    this.getMonths();
    this.getYears();

    // this.setState({ dateOfDiagFromDb: this.props.dateOfDiagFromDb });
    // var EditYear = this.props.dateOfDiagFromDb;
    // var EditMonth = this.props.dateOfDiagFromDb;
    // var EditDate = this.props.dateOfDiagFromDb;
    var dateOfDiagFromDb = this.props.dateOfDiagFromDb + "";
    // EditDate = "20041012"

    console.log("REGX MATCH :" + dateOfDiagFromDb);

    // var res =
    // if (
    //   dateOfDiagFromDb.match(/[0-9][0-9]\/[0-9][0-9]\/[0-9][0-9][0-9][0-9]/)
    // ) {
    //   console.log("REGX MATCH FOUND");
    //   this.setDatePicker(this.convertDateToString(dateOfDiagFromDb));
    // } else {
    //   this.setDatePicker(dateOfDiagFromDb);
    // }
    this.setDatePicker(dateOfDiagFromDb);

    // this.state.dateOfDiagFromDb = this.props.dateOfDiagFromDb;
    // EditDate = this.props.dateOfDiagFromDb + "";
    // console.log("PICKER VALUES db : " + "" + this.state.dateOfDiagFromDb.substring(0, 4))

    // this.state.selectedEditYear = dateOfDiagFromDb.substr(0, 4)
    // this.state.selectedEditMonth = dateOfDiagFromDb.substr(4, 6)
    // this.state.selectedEditDate = dateOfDiagFromDb.substr(6, 8)

    console.log("PICKER VALUES : " + "" + this.state.selectedEditDate);
  }

  setDatePicker(dateOfDiagFromDb) {
    // console.log("PICKER VALUES year : " + dateOfDiagFromDb.substr(0, 4));
    console.log("PICKER VALUES mnth: " + this.state.selectedEditMonth);
    // console.log("PICKER VALUES date: " + dateOfDiagFromDb.substr(6, 2));

    // this.setState({ selectedEditYear: dateOfDiagFromDb.substr(0, 4) });
    // this.setState({ selectedEditMonth: dateOfDiagFromDb.substr(4, 2) });
    // this.setState({ selectedEditDate: dateOfDiagFromDb.substr(6, 2) });

    this.state.selectedEditYear = dateOfDiagFromDb.substr(0, 4);
    this.state.selectedEditMonth = dateOfDiagFromDb.substr(4, 2) == '' ? "10" : dateOfDiagFromDb.substr(4, 2);
    this.state.selectedEditDate = dateOfDiagFromDb.substr(6, 2) == '' ? "12" : dateOfDiagFromDb.substr(6, 2);

    console.log("PICKER VALUES year : " + this.state.selectedEditYear.substr(0, 4));
    console.log("PICKER VALUES mnth: " + this.state.selectedEditMonth.substr(4, 2));
    console.log("PICKER VALUES date: " + this.state.selectedEditDate.substr(6, 2));

  }

  componentDidMount() {
    // this.setState({ dateOfDiagFromDb: this.props.dateOfDiagFromDb });
    // var EditYear = this.props.dateOfDiagFromDb;
    // var EditMonth = this.props.dateOfDiagFromDb;
    // var EditDate = this.props.dateOfDiagFromDb;
    // // EditDate = "20041012"
    // // this.state.dateOfDiagFromDb = this.props.dateOfDiagFromDb;
    // EditDate = this.props.dateOfDiagFromDb + "";
    // // console.log("PICKER VALUES db : " + "" + this.state.dateOfDiagFromDb.substring(0, 4))
    // console.log("PICKER VALUES : " + EditDate.substr(6, 8))
    // this.setState({ selectedEditYear: EditYear });
    // this.setState({ selectedEditMonth: EditMonth });
    // this.setState({ selectedEditDate: EditDate.substr(6, 8) });
    // this.state.selectedEditDate = EditDate.substr(6, 8)
    // console.log("PICKER VALUES : " + "" + this.state.selectedEditDate)
  }
  getDateArray() {
    var i;
    for (i = 1; i < 32; i++) {
      if (i < 10) {
        this.state.dateArray[i] = "0" + i;
      } else {
        this.state.dateArray[i] = i;
      }

      // console.log(this.state.dateArray[i])
    }
    this.state.dateArray[i + 1] = 99;
  }

  getMonths() {
    var i;
    for (i = 1; i < 13; i++) {
      if (i < 10) {
        this.state.monthArray[i] = "0" + i;
      } else {
        this.state.monthArray[i] = i;
      }
      // console.log(this.state.monthArray[i])
    }

    this.state.monthArray[i + 1] = 99;
  }

  getYears() {
    var i;
    var j = 0;
    for (i = 2019; i > 1800; i--) {
      j = ++j;
      this.state.yearArray[j] = i;
      // console.log("j"+ j)
    }
    this.state.yearArray[j + 1] = 9999;
  }
  render() {
    const alignLeft0 = {
      paddingLeft: "0px"
    };

    return (
      <div className="date-table">
        <div className="col-sm-4" style={alignLeft0}>
          <select
            disabled={this.props.isAlive}
            className="form-control "
            defaultValue={this.state.selectedEditMonth}
            onChange={this.setMonth.bind(this)}
            name="monthColumn"
          >
            <option>{"Month"}</option>
            {this.state.monthArray.map((value, i) => {
              // console.log("ageGroup ID :  " + ageGroup);
              return (
                <option key={i} /*defaultValue={ageGroup}*/>{value}</option>
              );
            })}
          </select>
        </div>
        {/* </td> */}
        {/* <td> */}
        <div className="col-sm-4">
          <select
            disabled={this.props.isAlive}
            className="form-control "
            defaultValue={this.state.selectedEditDate}
            onChange={this.setDate.bind(this)}
            name="dateColumn"
          >
            <option>{"Day"}</option>

            {this.state.dateArray.map((value, i) => {
              // console.log("ageGroup ID :  " + ageGroup);
              return (
                <option key={i} /*defaultValue={ageGroup}*/>{value}</option>
              );
            })

              // <option >{"Hospital Rec"}</option>
            }
          </select>
        </div>
        <div className="col-sm-4">
          <select
            disabled={this.props.isAlive}
            className="form-control "
            defaultValue={this.state.selectedEditYear}
            onChange={this.setYear.bind(this)}
            name="yearColumn"
          >
            <option>{"Year"}</option>

            {this.state.yearArray.map((value, i) => {
              // console.log("ageGroup ID :  " + ageGroup);
              return <option key={i} /*value={ageGroup}*/>{value}</option>;
            })

              // <option >{"Hospital Rec"}</option>
            }
          </select>
        </div>
      </div>
    );
  }
}
