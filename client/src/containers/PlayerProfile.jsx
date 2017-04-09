import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import { Col, Row } from 'react-bootstrap'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { FixtureDisplay } from 'utils'
import { RegionIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'
import TeamSnippet from 'containers/TeamSnippet'
import { withPlayer } from 'components/connectors/WithPlayer'

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

    render() {
        const { player, fixtures: { regions, positions, skillBrackets } } = this.props
        return (
            <div>
                <Helmet>
                    <title>{`${player.username} - Player Profile | Dota 2 Team Finder`}</title>
                    <meta name="description" content={`View ${player.username}'s profile on Dota 2 team finder.`} />
                </Helmet>
                <h1>Player Profile</h1>
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
                    {player.teams && player.teams.map(team => (
                        <Row key={`row-player-${player.id}-team-${team.id}`}>
                            <Col md={8}>
                                <TeamSnippet teamId={team.id} />
                            </Col>
                        </Row>
                    ))}
                </div>
            </div>
        )
    }

}

PlayerProfile = withPlayer(props => props.params.id)(PlayerProfile)

PlayerProfile = withAllFixtures(PlayerProfile)

export default PlayerProfile
