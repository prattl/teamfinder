import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestTeam } from 'actions/teams'

import { Link } from 'react-router'
import { Label } from 'react-bootstrap'
import { withAllFixtures } from 'components/forms/PlayerSearchForm'
import { FixtureDisplay, Loading } from 'utils'
import { CaptainIcon, RegionIcon, PlayersIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'

class TeamProfile extends Component {

    componentDidMount() {
        this.props.dispatch(requestTeam(this.props.params.id))
        // console.log("PARAMS: ", this.props.params)
    }

    render() {
        const id = this.props.params.id
        const { teams } = this.props.teams
        // if teams[id] is undefined or empty
        const team = teams[id] || {}
        const isLoading = team.isLoading
        const lastUpdated = team.lastUpdated

        // or ...
        // const teams = this.props.teams
        // const team = teams.team
        // const isLoading = teams.isLoading
        // const lastUpdated = teams.lastUpdated

        const { fixtures: { regions, positions, skillBrackets } } = this.props

        console.log('TEAM: ', team)

        return (
            <div>
                <h1>Team Profile</h1>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <div>
                                <div>
                                    <h2 className='pull-left'>
                                        {team.team.name}
                                    </h2>
                                    <span className='pull-right'>
                                        <i className={`fa fa-${team.team.available_positions.length > 0 ? 'check-square-o' : 'square-o'}`}/>
                                        &nbsp;Recruiting
                                    </span>
                                    <div style={{ clear: 'both' }}/>
                                </div>

                                <div>
                                    <RegionIcon fixedWidth={true}/>&nbsp;
                                    <FixtureDisplay value={team.team.regions} fixture={regions}/>
                                </div>
                                <div>
                                    <SkillBracketIcon fixedWidth={true}/>&nbsp;
                                    <FixtureDisplay value={team.team.skill_bracket} fixture={skillBrackets}/>
                                </div>
                                {team.team.available_positions.length > 0 &&
                                <div>
                                    <PositionIcon fixedWidth={true}/>&nbsp;Recruiting:&nbsp;
                                    <FixtureDisplay value={team.team.available_positions} fixture={positions}/>
                                </div>
                                }
                                <div>
                                <PlayersIcon fixedWidth={true}/>&nbsp;
                                {team.team.team_members.map(teamMember => (
                                    <div style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                         key={`team-member-${teamMember.id}`}>
                                        <Link to={`/players/${teamMember.player.id}/`} style={{ color: '#FFF' }}>
                                            <Label>
                                                {team.captain === teamMember.player.id && (
                                                    <span><CaptainIcon />&nbsp;</span>
                                                )}
                                                {teamMember.player.username} - {positions.items[teamMember.position].name}
                                            </Label>
                                        </Link>
                                    </div>

                                ))}
                            </div>
                            </div>
                        </div>
                    ) : <div>Error loading team</div>
                )}
            </div>
        )
    }
}

// higher order component function that takes in a component
TeamProfile = connect(
    // 1
    // state -> jsobject(json/pythondict/etc...)
    // => : function
    // {object notation}
    state => ({
        // : : ...
        teams : state.teams
    })

    // 2
    // function(state) {
    //     return ({
    //         teams : state.teams
    //     })
    // }
)(TeamProfile)

TeamProfile = withAllFixtures(TeamProfile)

export default TeamProfile
