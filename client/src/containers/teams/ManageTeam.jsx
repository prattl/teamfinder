import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { LinkContainer } from 'react-router-bootstrap'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import requireAuthentication from 'components/auth/AuthenticationRequired'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'
import { withTeam } from 'components/connectors/WithTeam'
import ManageApplications from 'containers/teams/ManageApplications'
import ManageInvitations from 'containers/teams/ManageInvitations'
import ManageTeamMembers from 'containers/teams/ManageTeamMembers'
import DeleteTeamMemberConfirmModal from 'containers/teams/modals/DeleteTeamMemberConfirmModal'
import { cancelDeleteTeam, tryDeleteTeam, deleteTeam, cancelDeleteTeamMember, tryDeleteTeamMember,
    deleteTeamMember, tryPromoteToCaptain, cancelPromoteToCaptain, promoteToCaptain } from 'actions/teams'
import { Loading, playerIsCaptain } from 'utils'

const canEditTeam = (player, team) => (
    player && team && playerIsCaptain(player, team)
)

class ManageTeam extends Component {

    static propTypes = {
        team: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.handleDeleteTeamClick = this.handleDeleteTeamClick.bind(this)
        this.handleDeleteTeamConfirmClick = this.handleDeleteTeamConfirmClick.bind(this)
        this.handleDeleteTeamCancelClick = this.handleDeleteTeamCancelClick.bind(this)
        this.handleLeaveTeamClick = this.handleLeaveTeamClick.bind(this)
    }

    handleDeleteTeamClick() {
        const { tryDeleteTeam, team: { team: { id } } } = this.props
        tryDeleteTeam(id)
    }

    handleDeleteTeamConfirmClick() {
        const { deleteTeam, team: { team: { id } } } = this.props
        deleteTeam(id)
    }

    handleDeleteTeamCancelClick() {
        const { cancelDeleteTeam, team: { team: { id } } } = this.props
        cancelDeleteTeam(id)
    }

    handleLeaveTeamClick() {
        const { tryDeleteTeamMember, team: { team }, player } = this.props
        const teamMember = team.team_members.find(teamMember => teamMember.player.id === player.id)
        tryDeleteTeamMember({ teamMemberId: teamMember.id, teamId: team.id })
    }

    renderDeleteTeamConfirmModal() {
        const { team: { confirmDelete, team } } = this.props
        return (
            <Modal show={confirmDelete}>
                <Modal.Header>
                    <Modal.Title>Confirm Delete Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete <strong>{team.name}</strong>? This cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='link' onClick={this.handleDeleteTeamCancelClick}>Cancel</Button>
                    <Button bsStyle='danger' onClick={this.handleDeleteTeamConfirmClick}>Delete</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        const { team: teamInstance, team: { team, isLoading, lastUpdated }, player } = this.props
        const hasEditPermission = canEditTeam(player, team)

        return (
            <div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {this.renderDeleteTeamConfirmModal()}
                            <DeleteTeamMemberConfirmModal player={player} team={teamInstance} />
                            <h1>
                                Manage Team: {team.name}&nbsp;
                                <span className='pull-right'>
                                    <ButtonToolbar>
                                        {hasEditPermission && (
                                            <LinkContainer to={`/teams/${team.id}/`}>
                                                <Button bsSize='sm'>
                                                    <i className='fa fa-eye'/>&nbsp;View
                                                </Button>
                                            </LinkContainer>
                                        )}
                                        {hasEditPermission && (
                                            <LinkContainer to={`/teams/edit/${team.id}/`}>
                                                <Button bsSize='sm'>
                                                    <i className='fa fa-pencil'/>&nbsp;Edit
                                                </Button>
                                            </LinkContainer>
                                        )}
                                        <Button bsStyle='warning' bsSize='sm' onClick={this.handleLeaveTeamClick}>
                                            Leave Team
                                        </Button>
                                        {hasEditPermission && (
                                            <Button bsStyle='danger' bsSize='sm' onClick={this.handleDeleteTeamClick}>
                                                <i className='fa fa-trash'/>&nbsp;Delete
                                            </Button>
                                        )}
                                    </ButtonToolbar>
                                </span>
                            </h1>
                            <h2>Roster</h2>
                            <ManageTeamMembers team={teamInstance} player={player} />
                            <h2>Applications</h2>
                            <ManageApplications team={team} player={player} />
                            <h2>Invitations</h2>
                            <ManageInvitations team={team} player={player} />
                        </div>
                    ) : (
                        <div>Error retrieving team.</div>
                    )
                )}
            </div>
        )
    }
}

ManageTeam = withAllFixtures(ManageTeam)
ManageTeam = withOwnPlayer(ManageTeam)
ManageTeam = withTeam(props => props.params.id)(ManageTeam)
ManageTeam = requireAuthentication(ManageTeam)
ManageTeam = connect(
    null,
    {
        cancelDeleteTeam,
        deleteTeam,
        tryDeleteTeam,
        cancelDeleteTeamMember,
        deleteTeamMember,
        tryDeleteTeamMember,
        tryPromoteToCaptain,
        cancelPromoteToCaptain,
        promoteToCaptain
    }
)(ManageTeam)

export default ManageTeam
