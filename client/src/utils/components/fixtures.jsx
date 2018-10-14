import React, { Component } from "react";
import { connect } from "react-redux";

import { requestAllFixturesIfNeeded } from "actions/fixtures";

export const withFixtures = selector => WrappedComponent => {
  class WithFixtures extends Component {
    componentDidMount() {
      this.props.onLoad();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
  WithFixtures = connect(
    selector,
    { onLoad: requestAllFixturesIfNeeded }
  )(WithFixtures);
  return WithFixtures;
};
