import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { requestTeam } from 'actions/teams'

import { Link } from 'react-router'
import { Label } from 'react-bootstrap'
import { Button, ButtonToolbar, Col, Modal, Row, Table } from 'react-bootstrap'
import requireAuthentication from 'components/auth/AuthenticationRequired'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { withTeam, withTeamFromParams } from 'components/connectors/WithTeam'
import { requestPlayer } from 'actions/playerSearch'
import { cancelDeleteTeam, tryDeleteTeam, deleteTeam } from 'actions/teams'
import { playerSearchSelector } from 'utils/selectors'
import { FixtureDisplay, Loading, playerIsCaptain } from 'utils'
import { CaptainIcon, RegionIcon, PlayersIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'

class ManageTeam extends Component {

    static propTypes = {
        team: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)
        this.handleDeleteTeamClick = this.handleDeleteTeamClick.bind(this)
        this.handleDeleteTeamConfirmClick = this.handleDeleteTeamConfirmClick.bind(this)
        this.handleDeleteTeamCancelClick = this.handleDeleteTeamCancelClick.bind(this)
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

    handleDeleteTeamMemberClick() {

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

    renderTeamMemberRow(teamMember) {
        const { team: { team },
            fixtures: { positions }
        } = this.props
        return (
            <tr key={teamMember.id}>
                <td>
                    {teamMember.player.username}&nbsp;
                    (<Link to={`/players/${teamMember.player.id}/`}>
                        profile
                    </Link>)
                </td>
                <td>{teamMember.position && positions.items[teamMember.position].name}</td>
                <td>
                    <ButtonToolbar>
                        <Button bsSize='xs' bsStyle='danger'>Remove</Button>
                        {!playerIsCaptain(teamMember.player, team) && <Button bsSize='sm'>Make Captain</Button>}
                    </ButtonToolbar>
                </td>
            </tr>
        )
    }

    render() {
        const { team: { team, isLoading, lastUpdated } } = this.props
        return (
            <div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {this.renderDeleteTeamConfirmModal()}
                            <h1>
                                Manage Team: {team.name}&nbsp;
                                <span className='pull-right'>
                                <Button bsStyle='danger' bsSize='sm' onClick={this.handleDeleteTeamClick}>
                                    <i className='fa fa-trash'/>&nbsp;Delete
                                </Button></span>
                            </h1>
                            <h2>Players</h2>
                            <div>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Player</th>
                                            <th>Position</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {team.team_members.map(teamMember => (
                                            this.renderTeamMemberRow(teamMember)
                                        ))}
                                    </tbody>
                                </Table>

                            </div>
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
ManageTeam = withTeam(props => props.params.id)(ManageTeam)
ManageTeam = requireAuthentication(ManageTeam)
ManageTeam = connect(
    null,
    {
        cancelDeleteTeam,
        deleteTeam,
        tryDeleteTeam
    }
)(ManageTeam)

export default ManageTeam
