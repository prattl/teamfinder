import React, { Component } from 'react'
import { compose } from 'redux'

import { Button, Label } from 'react-bootstrap'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { FixtureDisplay, Loading, playerIsOnTeam } from 'utils'
import { CaptainIcon, RegionIcon, PlayersIcon, PositionIcon, MMRIcon } from 'utils/components/icons'

import { withAllFixtures } from 'components/connectors/WithFixtures'
import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'
import { withTeam } from 'components/connectors/WithTeam'

class TeamSnippet extends Component {

    render() {
        const { fixtures: { regions, positions } } = this.props
        const { team: { team, isLoading, lastUpdated }, player, newItems: { new_team_applications } } = this.props
        return (
            <div style={{ padding: '1rem', margin: '2rem 0', border: '1px solid #DDD' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <div>
                                <h4 className='pull-left'>
                                    <Link to={`/teams/${team.id}`}>{team.name}</Link>
                                    {playerIsOnTeam(player, team) && (
                                        <span>
                                            &nbsp;
                                            <LinkContainer to={`/teams/manage/${team.id}/`}>
                                                <Button bsSize='sm'>
                                                    <i className='fa fa-cog'/>&nbsp;Manage
                                                </Button>
                                            </LinkContainer>
                                            {new_team_applications > 0 && (
                                                <span>
                                                    &nbsp;
                                                    <Label bsStyle='info' bsSize='md'>
                                                        <i className='fa fa-exclamation-circle' />&nbsp;
                                                        {new_team_applications} new application{new_team_applications > 1 && 's'}
                                                    </Label>
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </h4>
                                <span className='pull-right'>
                                    <div className='text-right'>

                                        <i className={`fa fa-${team.available_positions.length > 0 ? 'check-square-o' : 'square-o'}`}/>
                                            &nbsp;Recruiting
                                    </div>
                                    <div>

                                    </div>
                                </span>
                                <div style={{ clear: 'both' }}/>
                            </div>

                            <div>
                                <RegionIcon fixedWidth={true}/>&nbsp;
                                <FixtureDisplay value={team.regions} fixture={regions}/>
                            </div>
                            {/*<div>*/}
                                {/*<MMRIcon fixedWidth={true}/>&nbsp;*/}
                                {/*<FixtureDisplay value={team.average_mmr}/>*/}
                            {/*</div>*/}
                            {team.available_positions.length > 0 &&
                                <div>
                                    <PositionIcon fixedWidth={true}/>&nbsp;Recruiting:&nbsp;
                                    <FixtureDisplay value={team.available_positions} fixture={positions}/>
                                </div>
                            }
                            <div>
                                <PlayersIcon fixedWidth={true}/>&nbsp;
                                {team.team_members.map(teamMember => (
                                    <div style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                         key={`team-member-${teamMember.id}`}>
                                        <Link to={`/players/${teamMember.player.id}/`} style={{ color: '#FFF' }}>
                                            <Label>
                                                {team.captain === teamMember.player.id && (
                                                    <span><CaptainIcon />&nbsp;</span>
                                                )}
                                                {teamMember.player.username}{teamMember.position && (
                                                    ` - ${positions.items[teamMember.position] && positions.items[teamMember.position].name}`
                                                )}
                                            </Label>
                                        </Link>
                                    </div>

                                ))}
                            </div>
                        </div>
                    ) : null
                )}
            </div>
        )
    }

}

TeamSnippet = compose(
    withOwnPlayer,
    withTeam(props => props.teamId),
    withAllFixtures
)(TeamSnippet)

export default TeamSnippet
