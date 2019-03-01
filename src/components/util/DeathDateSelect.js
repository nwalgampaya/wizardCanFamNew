import React from "react";
// import React, { Component } from 'react';
import "../../App.css";
import DateSelect from "./DateSelect";

export default class DeathDateSelect extends DateSelect {
  constructor(props) {
    super(props);
    this.validateYear.bind(this);
  }

  setDate(event) {
    console.log("date Value" + event.target.value);
    this.setState({ selectedDate: event.target.value }, event =>
      this.validateDate(event)
    );
  }

  setMonth(event) {
    console.log("selectedMonth Value" + event.target.value);
    this.setState({ selectedMonth: event.target.value }, event =>
      this.validateMonth(event)
    );
  }
  setYear(event) {
    console.log("selectedYear Value" + event.target.value);
    this.setState({ selectedYear: event.target.value }, event =>
      this.validateYear(event)
    );
  }

  // validateYear(event) {
  //   this.props.onSelectYear(event.target.value);
  //   this.props.onChangeDeathDate(event.target.value);
  // }

  validateYear = event => {
    this.props.onSelectYear(event.target.value);
    //this.props.onChangeDeathDate(event.target.value);
  };
  validateMonth = event => {
    this.props.onSelectMonth(event.target.value);
    //this.props.onChangeDeathDate(event.target.value);
  };
  validateDate = event => {
    this.props.onSelectDate(event.target.value);
    //this.props.onChangeDeathDate(event.target.value);
  };
}
