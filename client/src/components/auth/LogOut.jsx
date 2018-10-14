import React, { Component } from "react";
import { connect } from "react-redux";
import { logout } from "actions/auth";

class LogOut extends Component {
  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    return (
      <div>
        <h1>Log Out</h1>
        <p>Thanks for using the Dota 2 Team Finder!</p>
      </div>
    );
  }
}

LogOut = connect(
  null,
  { onLoad: logout }
)(LogOut);

export default LogOut;
