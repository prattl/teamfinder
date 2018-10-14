import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router";
import { Alert, Button, ButtonToolbar, Modal, Table } from "react-bootstrap";
import { withAllFixtures } from "components/connectors/WithFixtures";
import TeamMemberPosition from "components/forms/TeamMemberPosition";
import DeleteTeamMemberConfirmModal from "components/teams/modals/DeleteTeamMemberConfirmModal";
import {
  tryDeleteTeamMember,
  tryPromoteToCaptain,
  cancelPromoteToCaptain,
  promoteToCaptain
} from "actions/teams";
import { playerIsCaptain } from "utils";
import { CaptainIcon } from "utils/components/icons";

const canRemoveTeamMember = (player, team, member) =>
  playerIsCaptain(player, team) &&
  team.captain !== member.player.id &&
  team.team_members.length > 1;

const canBePromotedToCaptain = (player, team, member) =>
  playerIsCaptain(player, team) && team.captain !== member.player.id;

const canEditTeamMemberPosition = (player, team) =>
  playerIsCaptain(player, team);

class ManageTeamMembers extends Component {
  static propTypes = {
    player: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired
  };

  handleDeleteTeamMemberClick(teamMemberId) {
    const {
      tryDeleteTeamMember,
      team: {
        team: { id }
      }
    } = this.props;
    tryDeleteTeamMember({ teamMemberId, teamId: id });
  }

  handlePromoteToCaptainClick(teamMemberId) {
    const {
      tryPromoteToCaptain,
      team: {
        team: { id }
      }
    } = this.props;
    tryPromoteToCaptain({ teamMemberId, teamId: id });
  }

  handlePromoteToCaptainConfirmClick(teamMemberId) {
    const {
      promoteToCaptain,
      team: {
        team: { id }
      }
    } = this.props;
    promoteToCaptain(teamMemberId, id);
  }

  handlePromoteToCaptainCancelClick() {
    const {
      cancelPromoteToCaptain,
      team: {
        team: { id }
      }
    } = this.props;
    cancelPromoteToCaptain({ teamId: id });
  }

  renderPromoteToCaptainConfirmModal() {
    const {
      team: { confirmPromoteToCaptain, confirmPromoteToCaptainError, team }
    } = this.props;
    const teamMember = team.team_members.find(
      member => member.id === confirmPromoteToCaptain
    );
    return (
      teamMember && (
        <Modal show={Boolean(confirmPromoteToCaptain)}>
          <Modal.Header>
            <Modal.Title>Confirm Promote to Captain</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {confirmPromoteToCaptainError && (
              <Alert bsStyle="danger">{confirmPromoteToCaptainError}</Alert>
            )}
            <p>
              Are you sure you want to promote{" "}
              <strong>{teamMember.player.username}</strong> to be the captain of{" "}
              <strong>{team.name}</strong>? You will no longer be able to make
              changes to this team. This cannot be undone.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bsStyle="link"
              onClick={() =>
                this.handlePromoteToCaptainCancelClick(teamMember.id)
              }
            >
              Cancel
            </Button>
            <Button
              bsStyle="warning"
              onClick={() =>
                this.handlePromoteToCaptainConfirmClick(teamMember.id)
              }
            >
              Promote to Captain
            </Button>
          </Modal.Footer>
        </Modal>
      )
    );
  }

  renderTeamMemberRow(teamMember) {
    const {
      team: { team },
      player,
      fixtures: { positions }
    } = this.props;
    return (
      <tr key={teamMember.id}>
        <td>
          {playerIsCaptain(teamMember.player, team) && (
            <span>
              <CaptainIcon />
              &nbsp;
            </span>
          )}
          <Link to={`/players/${teamMember.player.id}/`}>
            {teamMember.player.username}
          </Link>
        </td>
        <td>
          {canEditTeamMemberPosition(player, team) ? (
            <TeamMemberPosition
              form={`position-${teamMember.id}`}
              teamMemberId={teamMember.id}
              initialValues={{ position: teamMember.position }}
            />
          ) : (
            <span>
              {teamMember.position && positions.items[teamMember.position].name}
            </span>
          )}
        </td>
        <td>
          <ButtonToolbar>
            <Button
              bsSize="sm"
              bsStyle="danger"
              disabled={!canRemoveTeamMember(player, team, teamMember)}
              onClick={() => this.handleDeleteTeamMemberClick(teamMember.id)}
            >
              Remove
            </Button>
            <Button
              bsSize="sm"
              disabled={!canBePromotedToCaptain(player, team, teamMember)}
              onClick={() => this.handlePromoteToCaptainClick(teamMember.id)}
            >
              Promote to Captain
            </Button>
          </ButtonToolbar>
        </td>
      </tr>
    );
  }

  render() {
    const {
      team: teamInstance,
      team: { team },
      player
    } = this.props;

    return (
      <div>
        <div>
          <DeleteTeamMemberConfirmModal player={player} team={teamInstance} />
          {this.renderPromoteToCaptainConfirmModal()}
          <div>
            <Table responsive>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.team_members.map(teamMember =>
                  this.renderTeamMemberRow(teamMember)
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

ManageTeamMembers = withAllFixtures(ManageTeamMembers);
ManageTeamMembers = connect(
  null,
  {
    tryDeleteTeamMember,
    tryPromoteToCaptain,
    cancelPromoteToCaptain,
    promoteToCaptain
  }
)(ManageTeamMembers);

export default ManageTeamMembers;
