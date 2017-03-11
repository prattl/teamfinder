import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { withAllFixtures } from 'components/connectors/WithFixtures'

import { Label } from 'react-bootstrap'
import { FixtureDisplay, Loading } from 'utils'
import { CaptainIcon, RegionIcon, PositionIcon, PlayersIcon, SkillBracketIcon } from 'utils/components/icons'

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

    render() {
        // console.log('TeamSearchResultPROPS: ', this.props)
        const { available_positions, captain, creator, id, name, regions, skill_bracket, team_members, fixtures } = this.props
        const isLoading = Object.keys(fixtures).some(fixture => fixtures[fixture].isLoading)
        const lastUpdated = Object.keys(fixtures).every(fixture => fixtures[fixture].lastUpdated)

        return(
            <div className='team-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <Link to={`teams/${id}`}>
                                    <strong>{name}</strong>
                                </Link>
                                <span className='pull-right'>
                                    <i className={`fa fa-${available_positions.length > 0 ? 'check-square-o' : 'square-o'}`}/>
                                    &nbsp;Recruiting
                                </span>
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
                            <div style={{ marginTop: '1rem' }}>
                                {available_positions.map(pos => (
                                    <div style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                         key={`team-${id}-position-${pos}`}>
                                        <Link to={`/positions/${pos.id}/`} style={{ color: '#FFF' }}>
                                            <Label>
                                                {pos.name}
                                            </Label>
                                        </Link>
                                    </div>

                                ))}
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

export default TeamSearchResult