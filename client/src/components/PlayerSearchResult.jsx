import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { withAllFixtures } from 'components/connectors/WithFixtures'

import { Label } from 'react-bootstrap'
import { FixtureDisplay, Loading } from 'utils'
import { CaptainIcon, RegionIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'

class PlayerSearchResult extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired,
        regions: PropTypes.array,
        positions: PropTypes.array,
        skill_bracket: PropTypes.string,
        teams: PropTypes.array
    }

    render() {
        const { id, fixtures, username, regions, positions, skill_bracket, teams } = this.props
        const isLoading = Object.keys(fixtures).some(fixture => fixtures[fixture].isLoading)
        const lastUpdated = Object.keys(fixtures).every(fixture => fixtures[fixture].lastUpdated)
        return (
            <div className='player-search-result' style={{ border: '1px solid #DDD', padding: '2rem', marginBottom: '2rem' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <div style={{ marginBottom: '1rem' }}>
                                <Link to={`players/${id}`}>
                                    <strong>{username}</strong>
                                </Link>
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
                                <PositionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={positions} fixture={fixtures.positions}/>
                            </div>
                            <div style={{ marginTop: '1rem' }}>
                                {teams.length === 0 && <Label style={{ visibility: 'hidden' }}>Placeholder</Label>}
                                {teams.map(team => (
                                    <div style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                         key={`player-${id}-team-${team.id}`}>
                                        <Link to={`/teams/${team.id}/`} style={{ color: '#FFF' }}>
                                            <Label>
                                                {team.captain === id && (<span><CaptainIcon />&nbsp;</span>)}
                                                {team.name}
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

PlayerSearchResult = withAllFixtures(PlayerSearchResult)

export default PlayerSearchResult
