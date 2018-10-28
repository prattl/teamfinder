import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Checkbox } from "react-bootstrap";

import { deleteAccount } from "actions/auth";

class DeleteAccount extends Component {
  constructor(props) {
    super(props);
    this.handleEnableClick = this.handleEnableClick.bind(this);
    this.state = {
      enabled: false
    };
  }
  handleEnableClick() {
    this.setState({ enabled: !this.state.enabled });
  }
  render() {
    const { onDelete } = this.props;
    const { enabled } = this.state;
    return (
      <div>
        {/* TODO: Disable delete if still captains of any teams */}
        <p>
          Click below to delete your account. All information incuding your
          profile, applications, and teams created will be deleted.
        </p>
        <Checkbox checked={enabled} onClick={this.handleEnableClick}>
          I understand that deleting my account is permanent and irreversible.
        </Checkbox>
        <Button bsStyle="danger" disabled={!enabled} onClick={onDelete}>
          Delete Account
        </Button>
      </div>
    );
  }
}

export default connect(
  null,
  {
    onDelete: deleteAccount
  }
)(DeleteAccount);
