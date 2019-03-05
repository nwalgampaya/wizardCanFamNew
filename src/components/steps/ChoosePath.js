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
    const buttonMargin = {
      marginRight: "25px"
    };
    const alignStyle = {
      textAlign: "center",
      marginBottom: "50px",
      marginTop: "25px",
      display: "flex",
      marginLeft: "30%"
    };
    return (
      <div>
        <div>
          <p>
            This tool is used to update the Last Known Alive Date (LKD) and
            other details of participants in the Colon Cancer Family Registry
          </p>
        </div>
        <div style={alignStyle}>
          <div>
            <button
              className="col-sm-12 chooseImage"
              style={buttonMargin}
              type="submit"
            >
              <img
                src={require("../../img/step-3.png")}
                onClick={this.handleFamily}
              />
            </button>
            <span className="col-sm-12">Family</span>
          </div>
          <div>
            <button className="col-sm-12 chooseImage" type="submit">
              <img
                src={require("../../img/step-4.png")}
                onClick={this.handleIndividual}
              />
            </button>
            <span className="col-sm-12">Individual</span>
          </div>
        </div>
      </div>
    );
  }
}
