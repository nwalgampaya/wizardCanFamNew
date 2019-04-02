import React from "react";
// import React, { Component } from 'react';

export default class ChoosePath extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chooseTheFamily: ""
    };

    this.handleFamily = this.handleFamily.bind(this);
    this.handleIndividual = this.handleIndividual.bind(this);
  }

  handleFamily() {
    this.setState({ chooseTheFamily: true });
    this.state.chooseTheFamily = true;
    console.log("in family : " + this.state.chooseTheFamily);
    this.props.onChooseOption(this.state.chooseTheFamily);
  }
  handleIndividual() {
    this.setState({ chooseTheFamily: false });
    this.state.chooseTheFamily = false;

    console.log("in individual : " + this.state.chooseTheFamily);

    this.props.onChooseOption(this.state.chooseTheFamily);
  }

  render() {
    var paraStyle = {
      color: "black",
      fontSize: "16px"
    };
    const buttonMargin = {
      marginRight: "25px"
    };
    const alignStyle = {
      textAlign: "center",
      marginBottom: "50px",
      marginTop: "25px",
      display: "flex",
      marginLeft: "10%"
    };
    var fontcolor = {
      color: "black",
      fontSize: "16px"
    };
    return (
      <div>
        <div>
          <p style={paraStyle}>
            This tool is used to update the Last Known Alive Date (LKD) and
            other details of participants in the Colon Cancer Family Registry
          </p>
        </div>
        <div style={alignStyle}>
          <div>
            <button
              onClick={this.handleFamily}
              className="col-sm-12 chooseImage"
              style={buttonMargin}
              type="submit"
            >
              <img
                src={require("../../img/family.png")}
              />
            </button>
            <span className="col-sm-12">Update family members</span>
          </div>
          <div>
            <button onClick={this.handleIndividual} className="col-sm-12 chooseImage" type="submit">
              <img
                src={require("../../img/individual.png")}
              />
            </button>
            <span className="col-sm-12">Update an individual</span>
          </div>
        </div>
      </div>
    );
  }
}
