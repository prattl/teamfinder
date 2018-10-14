import React, { Component } from "react";
import { connect } from "react-redux";

import { Button } from "react-bootstrap";
import { openFeedbackForm } from "actions/feedback";

class FeedbackButton extends Component {
  static defaultProps = {
    inline: false
  };

  render() {
    const { onClick, inline } = this.props;
    const props = inline ? { bsSize: "xs" } : {};
    return (
      <Button
        id="feedback-button"
        className={!inline && "fixed"}
        bsStyle="warning"
        onClick={() => onClick()}
        {...props}
      >
        <span className="hidden-xs">
          <strong>Submit Feedback</strong> <i>(alpha)</i>
        </span>
        <span className="visible-xs">
          <i className="fa fa-plus" />
        </span>
      </Button>
    );
  }
}
FeedbackButton = connect(
  null,
  {
    onClick: openFeedbackForm
  }
)(FeedbackButton);
export default FeedbackButton;
