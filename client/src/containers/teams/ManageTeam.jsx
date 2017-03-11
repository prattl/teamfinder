import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { requestTeam } from 'actions/teams'

import { Link } from 'react-router'
import { Label } from 'react-bootstrap'
import { Button, ButtonToolbar, Col, Row, Table } from 'react-bootstrap'
import requireAuthentication from 'components/auth/AuthenticationRequired'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { withTeam, withTeamFromParams } from 'components/connectors/WithTeam'
import { requestPlayer } from 'actions/playerSearch'
import { deleteTeam } from 'actions/teams'
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
    }

    handleDeleteTeamClick() {
        const { deleteTeam, team: { team: { id } } } = this.props
        console.log('Deleting', id)
        deleteTeam(id)
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
ManageTeam = connect(null, { deleteTeam })(ManageTeam)

export default ManageTeam
