import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { submit } from 'redux-form'
import { connect } from 'react-redux'
import moment from 'moment'

import { tryApplyToTeam, cancelApplyToTeam } from 'actions/player'

import { withAllFixtures } from 'components/connectors/WithFixtures'
import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'
import { Label, Button, Modal } from 'react-bootstrap'
import { FixtureDisplay, Loading, TeamMMRDisplay } from 'utils'
import { CaptainIcon, RegionIcon, PositionIcon, PlayersIcon, MMRIcon } from 'utils/components/icons'
import TeamApplicationForm from 'components/forms/TeamApplicationForm'

const steamSignInRedirectDomain = process.env.NODE_ENV === 'production' ?
    'https://dotateamfinder.com:8000' :
    'http://localhost:8000'

class TeamSearchResult extends Component {

    static propTypes = {
        available_positions: PropTypes.array,
        name: PropTypes.string.isRequired
    }

    renderApplyToTeamConfirmModal() {
        const { cancelApplyToTeam, id, player: { teamApplyingTo, id: playerId } } = this.props
        if (!playerId) {
            return this.renderSignInRequiredModal()
        }
        return (
            <Modal show={teamApplyingTo === id}>
                <Modal.Header>
                    <Modal.Title>Confirm Apply to Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Select the position you want to apply for.</p>
                    <TeamApplicationForm initialValues={{ team : this.props.id }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={cancelApplyToTeam} bsStyle='link' >
                        Cancel</Button>
                    <Button bsStyle='success' onClick={() => this.props.submit('application')}>Apply</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    renderSignInRequiredModal() {
        const { cancelApplyToTeam, id, player: { teamApplyingTo } } = this.props
        return (
            <Modal show={teamApplyingTo === id}>
                <Modal.Header>
                    <Modal.Title>Sign In Required</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        You need to sign in before you can apply to teams.
                    </p>
                    <p>
                        <Button href={`${steamSignInRedirectDomain}/login/steam/?next=/social-redirect`}>
                            <i className='fa fa-steam'/>&nbsp;Sign in with Steam
                        </Button>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={cancelApplyToTeam} bsStyle='link' >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        const { available_positions, captain, id, name, regions, team_members, fixtures, tryApplyToTeam, mmr_average,
            player: { teamApplyingTo }, updated } = this.props
        const isLoading = Object.keys(fixtures).some(fixture => fixtures[fixture].isLoading)
        const lastUpdated = Object.keys(fixtures).every(fixture => fixtures[fixture].lastUpdated)

        return(
            <div className='team-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {teamApplyingTo && this.renderApplyToTeamConfirmModal()}
                            <div style={{ marginBottom: '1rem' }}>
                                <Link to={`teams/${id}`}>
                                    <strong>{name}</strong>
                                </Link>
                                <span className='pull-right'>
                                    <i className={`fa fa-${available_positions.length > 0 ? 'check-square-o' : 'square-o'}`}/>
                                    &nbsp;Recruiting
                                </span>
                                <div style={{ clear: 'both' }} />
                                <Button style={{ marginTop: '1rem'}} bsSize='sm' className='pull-right'
                                        onClick={() => tryApplyToTeam(id)}>Apply</Button>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <RegionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={regions} fixture={fixtures.regions}/>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <MMRIcon fixedWidth={true}/>&nbsp;
                                <TeamMMRDisplay mmr={mmr_average}/>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <PositionIcon fixedWidth={true}/>&nbsp;Recruiting:&nbsp;
                                <FixtureDisplay value={available_positions} fixture={fixtures.positions}/>
                            </div>
                            <div>
                                <PlayersIcon fixedWidth={true}/>&nbsp;
                                {team_members.map(teamMember => (
                                    <div style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                         key={`team-member-${teamMember.id}`}>
                                        <Link to={`/players/${teamMember.player.id}/`} style={{ color: '#FFF' }}>
                                            <Label>
                                                {captain === teamMember.player.id && (
                                                    <span><CaptainIcon />&nbsp;</span>
                                                )}
                                                {teamMember.player.username}{teamMember.position && (
                                                    ` - ${fixtures.positions.items[teamMember.position].name}`
                                                )}
                                            </Label>
                                        </Link>
                                    </div>

                                ))}
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                Last updated {moment(updated).format('L')}
                            </div>
                        </div>
                    ) : <p>Error, please try again.</p>
                )}
            </div>
        )
    }

}

TeamSearchResult = withAllFixtures(TeamSearchResult)
TeamSearchResult = withOwnPlayer(TeamSearchResult)
TeamSearchResult =  connect(null, {
    submit,
    tryApplyToTeam,
    cancelApplyToTeam
})(TeamSearchResult)
export default TeamSearchResult
