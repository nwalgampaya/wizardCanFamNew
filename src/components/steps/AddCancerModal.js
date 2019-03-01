import React from 'react';
import ReactDOM from 'react-dom';
import { Button, DropdownButton, MenuItem, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class AddCancerModal extends React.Component {

  constructor(props, context) {
    super(props, context);

    // this.handleShow = this.handleShow.bind(this);
    // this.handleClose = this.handleClose.bind(this);
    // this.handleSave = this.handleSave.bind(this);    
    //   this.handleTxtChange = this.handleTxtChange.bind(this);

    this.state = {


      showAddCancer: false,
      textValue: 'test123',
      selectedId: ''
    };
  }

  date_diff_indays = function (date1, date2) {
    var dt1 = new Date(date1);
    var dt2 = new Date(date2);
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
  }
  convertDate(dateStr) {
    const [day, month, year] = dateStr.split("-")
    return new Date(year, month - 1, day)
  }
  date_split(dateOfDiagFromDb) {
    console.log("Year : " + dateOfDiagFromDb.substr(0, 4));
    console.log("Year : " + dateOfDiagFromDb.substr(4, 2));
    console.log("Year : " + dateOfDiagFromDb.substr(6, 2));

    // selectedEditYear = dateOfDiagFromDb.split(0,3);
    //     selectedEditMonth = dateOfDiagFromDb.split(4,5);
    //     selectedEditDate = dateOfDiagFromDb.split(6,7)
  }

  passToGetDate(date) {
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
    // formatDatestr;
    return this.getDate(date, month, year);

  }
  getDate(d, m, y) {
    var currentDate;
    if (d == "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m), 15);
      // currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));

      console.log("if---1 : " + currentDate)
    } else if (d == "99" && m == "99" && y != "9999") {
      currentDate = new Date(parseInt(y), 7, 1);
      console.log("if---2 : " + currentDate)

    } else if (d != "99" && m != "99" && y != "9999") {
      currentDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      console.log("if---3 : " + currentDate)

    }
    return currentDate;
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
  componentDidMount() {


    // console.log("getDate : " + this.passToGetDate("20000102"));
    // console.log("getDate : " + this.getDate("02", "01", "2000"));
    console.log("new Date : " + (new Date()));
    console.log("getDate : " + this.convert(new Date()));

    // this.date_split("20040317")

    // var d1 = new Date("12/31/1885")
    // var d2 = new Date("02/02/2005")
    // console.log(Math.floor((d2 - d1) / 31536000000));
    // // console.log("Minus : "+ this.date_diff_indays('12/02/2012', '11/04/2014').toUTCString());

    // if (d1 < new Date()) {
    //   console.log("In If");

    // } else {
    //   console.log("In else");

    // }
  }

  render() {
    return (
      <div>
        test
          </div>
    )
  }
}