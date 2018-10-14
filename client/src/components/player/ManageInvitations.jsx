import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

import { Link } from "react-router";
import {
  Badge,
  Button,
  ButtonToolbar,
  Modal,
  Table,
  Tab,
  Tabs
} from "react-bootstrap";

import TeamName from "components/teams/TeamName";
import { withPositions } from "components/connectors/WithFixtures";
import {
  requestPlayerInvitations,
  acceptInvitation,
  rejectInvitation,
  tryAcceptInvitation,
  cancelAcceptInvitation,
  tryRejectInvitation,
  cancelRejectInvitation
} from "actions/playerEvents";
import { Loading } from "utils";

const InvitationTabLabel = ({ children, count }) => (
  <span>
    {children}
    {count > 0 && (
      <span>
        {" "}
        <Badge>{count}</Badge>
      </span>
    )}
  </span>
);

const statusMapping = {
  Pending: 1,
  Accepted: 2,
  Rejected: 3,
  Expired: 4,
  Withdrawn: 5
};

class ManageInvitations extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleAcceptInvitationClick = this.handleAcceptInvitationClick.bind(
      this
    );
    this.handleAcceptCancelClick = this.handleAcceptCancelClick.bind(this);
    this.handleAcceptConfirmClick = this.handleAcceptConfirmClick.bind(this);
    this.handleRejectInvitationClick = this.handleRejectInvitationClick.bind(
      this
    );
    this.handleRejectCancelClick = this.handleRejectCancelClick.bind(this);
    this.handleRejectConfirmClick = this.handleRejectConfirmClick.bind(this);
  }

  componentDidMount() {
    const { requestPlayerInvitations } = this.props;
    requestPlayerInvitations();
  }

  handleAcceptInvitationClick(invitationId) {
    const { tryAcceptInvitation } = this.props;
    tryAcceptInvitation(invitationId);
  }

  handleAcceptCancelClick() {
    const { cancelAcceptInvitation } = this.props;
    cancelAcceptInvitation();
  }

  handleAcceptConfirmClick() {
    const {
      acceptInvitation,
      playerEvents: {
        invitations: { items, confirmAccept }
      }
    } = this.props;
    acceptInvitation(confirmAccept, items[confirmAccept]);
  }

  handleRejectInvitationClick(invitationId) {
    const { tryRejectInvitation } = this.props;
    tryRejectInvitation(invitationId);
  }

  handleRejectCancelClick() {
    const { cancelRejectInvitation } = this.props;
    cancelRejectInvitation();
  }

  handleRejectConfirmClick() {
    const {
      rejectInvitation,
      playerEvents: {
        invitations: { items, confirmReject }
      }
    } = this.props;
    rejectInvitation(confirmReject, items[confirmReject]);
  }

  renderAcceptConfirmModal() {
    const {
      positions,
      playerEvents: {
        invitations: { items, confirmAccept }
      }
    } = this.props;
    const invitation = confirmAccept ? items[confirmAccept] : null;

    return (
      invitation && (
        <Modal show={Boolean(confirmAccept)}>
          <Modal.Header>
            <Modal.Title>Confirm Accept Invitation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to accept{" "}
              <strong>
                <TeamName teamId={invitation.team} />
                's
              </strong>{" "}
              invitation? If you accept, you will be added to the team as{" "}
              {positions.items[invitation.position] &&
                positions.items[invitation.position].name}
              .
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="link" onClick={this.handleAcceptCancelClick}>
              Cancel
            </Button>
            <Button bsStyle="success" onClick={this.handleAcceptConfirmClick}>
              Accept
            </Button>
          </Modal.Footer>
        </Modal>
      )
    );
  }

  renderRejectConfirmModal() {
    const {
      playerEvents: {
        invitations: { items, confirmReject }
      }
    } = this.props;
    const invitation = confirmReject ? items[confirmReject] : null;

    return (
      invitation && (
        <Modal show={Boolean(confirmReject)}>
          <Modal.Header>
            <Modal.Title>Confirm Reject Invitation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Are you sure you want to reject{" "}
              <strong>
                <TeamName teamId={invitation.team} />
                's
              </strong>{" "}
              invitation? You will no logner be able to join the team from this
              invitation.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="link" onClick={this.handleRejectCancelClick}>
              Cancel
            </Button>
            <Button bsStyle="danger" onClick={this.handleRejectConfirmClick}>
              Reject
            </Button>
          </Modal.Footer>
        </Modal>
      )
    );
  }

  renderInvitationTab(index, statusLabel, statusIndex) {
    const {
      playerEvents: {
        invitations: { items }
      }
    } = this.props;
    let invitations = Object.keys(items).map(
      invitationId => items[invitationId]
    );
    invitations = invitations.filter(
      invitation => invitation.status === statusIndex
    );
    return (
      <Tab
        eventKey={index}
        key={`${statusLabel}-invitations-${index}`}
        title={
          <InvitationTabLabel count={invitations.length}>
            {statusLabel}
          </InvitationTabLabel>
        }
      >
        {this.renderInvitationsTable(invitations)}
      </Tab>
    );
  }

  renderInvitationsTable(invitations) {
    const { positions } = this.props;
    return (
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th>Team</th>
              <th>Position invited for</th>
              <th>Invited On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map(invitation => (
              <tr key={invitation.id}>
                <td>
                  <Link to={`/teams/${invitation.team}/`}>
                    <TeamName key={invitation.team} teamId={invitation.team} />
                  </Link>
                </td>
                <td>
                  {positions.items[invitation.position] &&
                    positions.items[invitation.position].name}
                </td>
                <td>{moment(invitation.created).format("L")}</td>
                <td>
                  {invitation.status === 1 && (
                    <ButtonToolbar>
                      <Button
                        bsSize="sm"
                        bsStyle="success"
                        onClick={() =>
                          this.handleAcceptInvitationClick(invitation.id)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        bsSize="sm"
                        bsStyle="danger"
                        onClick={() =>
                          this.handleRejectInvitationClick(invitation.id)
                        }
                      >
                        Reject
                      </Button>
                    </ButtonToolbar>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {invitations.length === 0 && (
          <div className="text-center">No invitations</div>
        )}
      </div>
    );
  }

  render() {
    const {
      playerEvents: {
        invitations: { isLoading, lastUpdated }
      }
    } = this.props;

    return (
      <div>
        {isLoading ? (
          <Loading />
        ) : lastUpdated ? (
          <div>
            {this.renderAcceptConfirmModal()}
            {this.renderRejectConfirmModal()}
            <Tabs defaultActiveKey={1} id="invitation-tabs">
              {Object.keys(statusMapping).map((statusText, i) =>
                this.renderInvitationTab(
                  i + 1,
                  statusText,
                  statusMapping[statusText]
                )
              )}
            </Tabs>
          </div>
        ) : (
          <div>Error retrieving invitations.</div>
        )}
      </div>
    );
  }
}

ManageInvitations = withPositions(ManageInvitations);
ManageInvitations = connect(
  state => ({
    playerEvents: state.playerEvents
  }),
  {
    requestPlayerInvitations,
    acceptInvitation,
    rejectInvitation,
    tryAcceptInvitation,
    cancelAcceptInvitation,
    tryRejectInvitation,
    cancelRejectInvitation
  }
)(ManageInvitations);

export default ManageInvitations;
