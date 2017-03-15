import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { submit } from 'redux-form'
import { connect } from 'react-redux'

import { withAllFixtures } from 'components/connectors/WithFixtures'

import { Label, Button, Modal } from 'react-bootstrap'
import { FixtureDisplay, Loading } from 'utils'
import { CaptainIcon, RegionIcon, PositionIcon, PlayersIcon, SkillBracketIcon } from 'utils/components/icons'
import TeamApplicationForm from 'components/forms/TeamApplicationForm'

class TeamSearchResult extends Component {

    // static == meaningless
    static propTypes = {
        available_positions: PropTypes.array,
        name: PropTypes.string.isRequired
    }

    // Player component
    // recruiting
    // players
    //

    constructor(props) {
        super(props)
        this.state = { teamApplyingTo : false}
    }

    renderApplyToTeamConfirmModal() {
        return (
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>Confirm Apply to Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Select the position you want to apply for.</p>
                    <TeamApplicationForm initialValues={{ team : this.props.id }} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({ teamApplyingTo : false })} bsStyle='link' >
                        Cancel</Button>
                    <Button bsStyle='success' onClick={() => this.props.submit('application')}>Apply</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        const { available_positions, captain, creator, id, name, regions, skill_bracket, team_members, fixtures } = this.props
        const isLoading = Object.keys(fixtures).some(fixture => fixtures[fixture].isLoading)
        const lastUpdated = Object.keys(fixtures).every(fixture => fixtures[fixture].lastUpdated)

        return(
            <div className='team-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            {this.state.teamApplyingTo && this.renderApplyToTeamConfirmModal()}
                            <div style={{ marginBottom: '1rem' }}>
                                <Link to={`teams/${id}`}>
                                    <strong>{name}</strong>
                                </Link>
                                <span className='pull-right'>
                                    <i className={`fa fa-${available_positions.length > 0 ? 'check-square-o' : 'square-o'}`}/>
                                    &nbsp;Recruiting
                                </span>
                                <div style={{ clear: 'both' }}></div>
                                <Button style={{ marginTop: '1rem'}} bsSize='sm' className='pull-right'
                                        onClick={() => this.setState({ teamApplyingTo : true })}>Apply</Button>
                            </div>
                            <div>
                                <RegionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={regions} fixture={fixtures.regions}/>
                            </div>
                            <div>
                                <SkillBracketIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={skill_bracket} fixture={fixtures.skillBrackets}/>
                            </div>
                            <div>
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
                        </div>
                    ) : <p>Error, please try again.</p>
                )}
            </div>
        )
    }

}

TeamSearchResult = withAllFixtures(TeamSearchResult)

TeamSearchResult =  connect(null, {submit})(TeamSearchResult
)
export default TeamSearchResult
