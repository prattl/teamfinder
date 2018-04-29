import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Alert, Button, Modal } from 'react-bootstrap'

import { cancelDeleteTeamMember, deleteTeamMember } from 'actions/teams'

class DeleteTeamMemberConfirmModal extends Component {

    static propTypes = {
        player: PropTypes.object.isRequired,
        team: PropTypes.object.isRequired,
    }

    handleDeleteTeamMemberConfirmClick(teamMemberId, leavingTeam=false) {
        const { deleteTeamMember, team: { team: { id } } } = this.props
        deleteTeamMember(teamMemberId, id, leavingTeam)
    }

    handleDeleteTeamMemberCancelClick() {
        const { cancelDeleteTeamMember, team: { team: { id } } } = this.props
        cancelDeleteTeamMember({ teamId: id })
    }

    render() {
        const { team: { confirmDeleteTeamMember, deleteTeamMemberError, team }, player } = this.props
        const teamMember = team.team_members.find(member => member.id === confirmDeleteTeamMember)
        const playerIsLeavingTeam = teamMember && teamMember.player.id === player.id
        return (
            teamMember ? (
                <Modal show={Boolean(confirmDeleteTeamMember)}>
                    <Modal.Header>
                        <Modal.Title>
                            {playerIsLeavingTeam ? 'Confirm Leave Team' : 'Confirm Remove Team Member'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {deleteTeamMemberError && (
                            <Alert bsStyle='danger'>
                                {deleteTeamMemberError}
                            </Alert>
                        )}
                        {playerIsLeavingTeam ? (
                            <p>
                                Are you sure you want to leave <strong>{team.name}</strong>? This cannot be undone.
                            </p>
                            ) : (
                            <p>
                                Are you sure you want to remove <strong>
                                {teamMember.player.username}
                                </strong> from <strong>{team.name}</strong>? This
                                cannot be undone.
                            </p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle='link'
                                onClick={() => this.handleDeleteTeamMemberCancelClick(teamMember.id)}>Cancel</Button>
                        <Button bsStyle='danger'
                                onClick={() => this.handleDeleteTeamMemberConfirmClick(teamMember.id, playerIsLeavingTeam)}>
                            {playerIsLeavingTeam ? 'Leave Team' : 'Remove'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : null
        )
    }
}

DeleteTeamMemberConfirmModal = connect(
    null,
    {
        cancelDeleteTeamMember,
        deleteTeamMember,
    }
)(DeleteTeamMemberConfirmModal)

export default DeleteTeamMemberConfirmModal
