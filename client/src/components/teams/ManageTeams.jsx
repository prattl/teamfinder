import React, { Component } from 'react'
import { compose } from 'redux'

import { Button, Col, Row } from 'react-bootstrap'

import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'
import requireAuthentication from 'components/auth/AuthenticationRequired'
import ManageApplications from 'components/player/ManageApplications'
import ManageInvitations from 'components/player/ManageInvitations'
import { LinkContainer } from 'react-router-bootstrap'
import { Loading } from 'utils'
import TeamSnippet from 'components/TeamSnippet'

class ManageTeams extends Component {

    render() {
        const { player, player: { teams }, isLoading, lastUpdated } = this.props
        return (
            <div>
                <div>
                    <h1>
                        My Teams&nbsp;
                        <LinkContainer to='/teams/create'>
                            <Button bsStyle='success' bsSize='sm'>
                                <i className='fa fa-plus'/>&nbsp;Create a team
                            </Button>
                        </LinkContainer>
                    </h1>
                </div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {teams && teams.length > 0 ? (teams.map(team => (
                                <Row key={`row-player-${player.id}-team-${team.id}`}>
                                    <Col md={8}>
                                        <TeamSnippet teamId={team.id} />
                                    </Col>
                                </Row>
                            ))) : (
                                <div>You're not on any teams yet.</div>
                            )}
                            <h2>Invitations</h2>
                            <ManageInvitations player={player} />
                            <h2>Applications</h2>
                            <ManageApplications player={player} />
                        </div>
                    ) : <div>Error loading player</div>
                )}
            </div>
        )
    }

}

ManageTeams = compose(
    withOwnPlayer,
    requireAuthentication
)(ManageTeams)

export default ManageTeams
