import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import moment from 'moment'

import { Button, Col, Image, Row } from 'react-bootstrap'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { FixtureDisplay } from 'utils'
import { RegionIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'
import TeamSnippet from 'containers/TeamSnippet'
import { withPlayer } from 'components/connectors/WithPlayer'
import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'

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

const FriendButton = ({ friends, steamId, ownSteamId, onClick }) => {
    let disabled = false
    let iconName = 'steam'
    let buttonText = 'Add friend on Steam'

    if (ownSteamId === steamId) {
        disabled = true
    } else if (friends && friends.includes(steamId)) {
        disabled = true
        iconName = 'check'
        buttonText = 'Already friends'
    }

    return (
        <Button bsStyle='default' href={`steam://friends/add/${steamId}/`}
                disabled={disabled} onClick={onClick}>
            <i className={`fa fa-${iconName}`}/>&nbsp;{buttonText}
        </Button>
    )
}

class PlayerProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            addedFriend: false
        }
    }

    handleAddFriendClick(e) {
        console.log(e)
        this.setState({ addedFriend: true })
    }

    render() {
        const { selectedPlayer: player, player: ownPlayer,
            fixtures: { regions, positions, skillBrackets } } = this.props
        const { addedFriend } = this.state

        if (addedFriend && ownPlayer.steam_friends && !ownPlayer.steam_friends.includes(player.steamid)) {
            ownPlayer.steam_friends.push(player.steamid)
        }

        return (
            <div>
                <Helmet>
                    <title>{`${player.username} - Player Profile | Dota 2 Team Finder`}</title>
                    <meta name="description" content={`View ${player.username}'s profile on Dota 2 team finder.`} />
                </Helmet>
                <h1>Player Profile</h1>
                <div>
                    <Row>
                        <Col xs={4} sm={3}>
                            <Image thumbnail src={player.avatarfull} />
                            <div style={{ marginTop: '1rem' }}>
                                <FriendButton friends={ownPlayer.steam_friends}
                                              steamId={player.steamid}
                                              ownSteamId={ownPlayer.steamid}
                                              onClick={e => this.handleAddFriendClick(e)} />
                            </div>
                        </Col>
                        <Col xs={8} sm={9}>
                            <h2 style={{ marginTop: 0 }}>{player.username}</h2>
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
                            <div style={{ marginTop: '1rem' }} />
                            <FixtureRow label='Last login:'>
                                <i className='fa fa-fw fa-clock-o' />&nbsp;
                                <span>{moment(player.last_login).format('L')}</span>
                            </FixtureRow>
                        </Col>
                    </Row>

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
PlayerProfile = withOwnPlayer(PlayerProfile)

PlayerProfile = withAllFixtures(PlayerProfile)

export default PlayerProfile
