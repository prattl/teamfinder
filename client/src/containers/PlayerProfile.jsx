import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { Col, Row } from 'react-bootstrap'
import { withAllFixtures } from 'components/forms/PlayerSearchForm'
import { requestPlayer } from 'actions/playerSearch'
import { playerSearchSelector } from 'utils/selectors'
import { FixtureDisplay, Loading } from 'utils'
import { RegionIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'
import TeamSnippet from 'containers/TeamSnippet'

import requireAuthentication from 'components/auth/AuthenticationRequired'

const FixtureRow = ({ label, children }) => (
    <Row>
        <Col sm={2} md={2} lg={2} className='hidden-xs'>
            {label}
        </Col>
        <Col xs={12} sm={6} md={4} lg={3}>
            {children}
        </Col>
    </Row>
)

class PlayerProfile extends Component {

    componentDidMount() {
        this.props.onLoad()
    }

    componentDidUpdate(oldProps) {
        if (this.props.params.id !== oldProps.params.id) {
            this.props.onLoad()
        }
    }

    render() {
        const { playerSearch: { player, playerIsLoading, playerLastUpdated } } = this.props
        const { fixtures: { regions, positions, skillBrackets } } = this.props
        return (
            <div>
                <h1>Player Profile</h1>
                {playerIsLoading ? <Loading /> : (
                    playerLastUpdated ? (
                        <div>
                            <h2>{player.username}</h2>
                            <FixtureRow label='Regions:'>
                                <RegionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={player.regions} fixture={regions}/>
                            </FixtureRow>
                            <FixtureRow label='Skill Bracket:'>
                                <SkillBracketIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={player.skill_bracket} fixture={skillBrackets}/>
                            </FixtureRow>
                            <FixtureRow label='Positions:'>
                                <PositionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={player.positions} fixture={positions}/>
                            </FixtureRow>
                            <h3>Teams</h3>
                            {player.teams.map(team => (
                                <Row key={`row-player-${player.id}-team-${team.id}`}>
                                    <Col md={8}>
                                        <TeamSnippet teamId={team.id} />
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    ) : <div>Error loading player</div>
                )}
            </div>
        )
    }

}

PlayerProfile = connect(
    createStructuredSelector({
        playerSearch: playerSearchSelector,
    }),
    (dispatch, props) => ({
        onLoad: () => dispatch(requestPlayer(props.params.id))
    })
)(PlayerProfile)

PlayerProfile = withAllFixtures(PlayerProfile)

PlayerProfile = requireAuthentication(PlayerProfile)

export default PlayerProfile
