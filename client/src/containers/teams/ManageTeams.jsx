import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestOwnPlayerIfNeeded } from 'actions/player'
import { playerSelector } from 'utils/selectors'

import { Button, Col, Row } from 'react-bootstrap'

import requireAuthentication from 'components/auth/AuthenticationRequired'
import { LinkContainer } from 'react-router-bootstrap'
import { Loading } from 'utils'
import TeamSnippet from 'containers/TeamSnippet'

class ManageTeams extends Component {

    componentDidMount() {
        this.props.onLoad()
    }

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
                        </div>
                    ) : <div>Error loading player</div>
                )}
            </div>
        )
    }

}

ManageTeams = connect(
    playerSelector,
    { onLoad: requestOwnPlayerIfNeeded }
)(ManageTeams)

ManageTeams = requireAuthentication(ManageTeams)

export default ManageTeams
