import React, { Component } from "react";
import * as Sentry from "@sentry/browser";
import { Button, Grid } from "react-bootstrap";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Sentry.configureScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
    });
    Sentry.captureException(error);
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <Grid>
          <h1>Sorry, something went wrong.</h1>
          <p>
            We encountered an error while processing your request. Submit a
            crash report below to help us diagnose the problem.
          </p>
          <p className="text-center">
            <a href="/">Click here to go back</a>
            {"  "}
            <Button bsStyle="warning" onClick={Sentry.showReportDialog}>
              Submit crash report
            </Button>
          </p>
        </Grid>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
