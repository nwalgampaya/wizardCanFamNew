import React from "react";

export default class FamilyFinish extends React.Component {
  render() {
    var fontcolor = {
      color: "black",
      fontSize: "16px"
    };
    return (
      <div>
        <div text-align="center">
          <p style={fontcolor}>
            Changes to the participant data have been saved
          </p>

          <p style={fontcolor}>
            Please click the "Finish" button below to conclude this session and
            return to the home screen.
          </p>
        </div>
      </div>
    );
  }
}
