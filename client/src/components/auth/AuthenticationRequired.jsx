import React, { Component } from "react";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import { requestAuthStatusIfNeeded } from "actions/auth";
import { authSelector } from "utils/selectors";

const requireAuthentication = WrappedComponent => {
  class AuthenticatedComponent extends Component {
    checkAuthenticationAndRedirect(props) {
      if (props.lastUpdated && !props.tokenVerified) {
        browserHistory.push("/login-required");
      }
    }

    componentDidMount() {
      this.props.onLoad();
      this.checkAuthenticationAndRedirect(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.checkAuthenticationAndRedirect(nextProps);
    }

    render() {
      const { tokenVerified } = this.props;
      return tokenVerified ? <WrappedComponent {...this.props} /> : null;
    }
  }

  AuthenticatedComponent = connect(
    authSelector,
    { onLoad: requestAuthStatusIfNeeded }
  )(AuthenticatedComponent);
  return AuthenticatedComponent;
};

export default requireAuthentication;
