import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import moment from 'moment'

import { LinkContainer } from 'react-router-bootstrap'
import { Button, Col, Image, Modal, Row } from 'react-bootstrap'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { FixtureDisplay, MMRDisplay } from 'utils'
import { InterestIcon, LanguageIcon, RegionIcon, PositionIcon, MMRIcon } from 'utils/components/icons'
import TeamSnippet from 'components/TeamSnippet'
import { withPlayer } from 'components/connectors/WithPlayer'
import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'

const FixtureRow = ({ label, children }) => (
    <Row style={{ marginBottom: '1rem' }}>
        <Col sm={2} md={2} lg={2} className='hidden-xs'>
            {label}
        </Col>
        <Col xs={12} sm={10} md={10} lg={10}>
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

const FriendAddedModal = ({ show, onClose, playerName }) => (
    <Modal show={show} onHide={onClose} backdrop='static'>
        <Modal.Header closeButton>
            <Modal.Title>Friend Request Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>
                If you have Steam installed, a friend request has been sent
                to {playerName}. <a href='steam://open/friends/'>Click here</a> to open your Steam friends to
                view the invitation.
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button bsStyle='success' onClick={onClose}>Ok</Button>
        </Modal.Footer>
    </Modal>
)

class PlayerProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            addedFriend: false,
            showAddedModal: false,
        }
    }

    handleAddFriendClick(e) {
        this.setState({
            addedFriend: true,
            showAddedModal: true,
        })
    }

    handleFriendAddedOkClick(e) {
        this.setState({
            showAddedModal: false,
        })
    }

    render() {
        const { selectedPlayer: player, player: ownPlayer,
            fixtures: { interests, languages, regions, positions } } = this.props
        const { addedFriend, showAddedModal } = this.state

        if (addedFriend && ownPlayer.steam_friends && !ownPlayer.steam_friends.includes(player.steamid)) {
            ownPlayer.steam_friends.push(player.steamid)
        }

        return (
            <div>
                <Helmet>
                    <title>{`${player.username} - Player Profile | Dota 2 Team Finder`}</title>
                    <meta name="description" content={`View ${player.username}'s profile on Dota 2 team finder.`} />
                </Helmet>
                <FriendAddedModal show={showAddedModal}
                                  playerName={player.username}
                                  onClose={e => this.handleFriendAddedOkClick(e)} />
                <h1>
                    Player Profile
                    {ownPlayer.id === player.id && (
                        <LinkContainer to={`/profile`} style={{ float: 'right' }}>
                            <Button bsSize='sm'>
                                <i className='fa fa-pencil'/>&nbsp;Edit Profile
                            </Button>
                        </LinkContainer>
                    )}
                </h1>
                <div>
                    <Row>
                        <Col xs={4} sm={3}>
                            <Image thumbnail src={player.avatarfull} />
                            <div style={{ marginTop: '1rem' }}>
                                <a href={`http://steamcommunity.com/profiles/${player.steamid}`}
                                   target='_blank'>
                                    View Steam Profile
                                </a>
                            </div>
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
                            <FixtureRow label='MMR:'>
                                <MMRIcon fixedWidth={true}/>&nbsp;
                                <MMRDisplay mmr={player.mmr} mmrEstimate={player.mmr_estimate} />
                            </FixtureRow>
                            <FixtureRow label='Positions:'>
                                <PositionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={player.positions} fixture={positions}/>
                            </FixtureRow>
                            {player.interests && player.interests.length > 0 && (
                                <FixtureRow label='Interests:'>
                                    <InterestIcon fixedWidth={true}/>&nbsp;
                                    <FixtureDisplay value={player.interests} fixture={interests}/>
                                </FixtureRow>
                            )}
                            <FixtureRow label='Languages:'>
                                <LanguageIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={player.languages} fixture={languages}/>
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
