import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import { Col, Image, Label, Row, } from 'react-bootstrap'

import Bio from 'components/utils'
import { requestTeam } from 'actions/teams'
import { Link } from 'react-router'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { FixtureDisplay, Loading, TeamMMRDisplay } from 'utils'
import { CaptainIcon, InterestIcon, LanguageIcon, RegionIcon, PlayersIcon, PositionIcon,
    MMRIcon } from 'utils/components/icons'

class TeamProfile extends Component {

    componentDidMount() {
        this.props.dispatch(requestTeam(this.props.params.id))
    }

    render() {
        const { params: { id }, teams: { teams } } = this.props
        const team = teams[id] || {}
        const isLoading = team.isLoading
        const lastUpdated = team.lastUpdated

        const { fixtures: { interests, languages, regions, positions } } = this.props

        return (
            <div>
                <Helmet>
                    <title>{`${team.team ? team.team.name : 'Team Profile'} | Dota 2 Team Finder`}</title>
                    <meta name="description" content="Team profile" />
                </Helmet>
                <h1>Team Profile</h1>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <Row>
                            <Col xs={4} sm={2}>
                                <Image src={team.team.logo_url || 'http://via.placeholder.com/300x300'}
                                       thumbnail />
                            </Col>
                            <Col xs={8} sm={10}>
                                <div>
                                    <h2 className='pull-left' style={{ marginTop: 0 }}>
                                        {team.team.name}
                                    </h2>
                                    <span className='pull-right'>
                                        <i className={`fa fa-${team.team.available_positions.length > 0 ? 'check-square-o' : 'square-o'}`}/>
                                        &nbsp;Recruiting
                                    </span>
                                    <div style={{ clear: 'both' }}/>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <RegionIcon fixedWidth={true}/>&nbsp;
                                    <FixtureDisplay value={team.team.regions} fixture={regions}/>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <MMRIcon fixedWidth={true}/>&nbsp;
                                    <TeamMMRDisplay mmr={team.team.mmr_average}/>
                                </div>
                                {team.team.available_positions.length > 0 &&
                                    <div style={{ marginBottom: '1rem' }}>
                                        <PositionIcon fixedWidth={true}/>&nbsp;Recruiting:&nbsp;
                                        <FixtureDisplay value={team.team.available_positions} fixture={positions}/>
                                    </div>
                                }
                                {team.team.interests.length > 0 &&
                                    <div style={{marginBottom: '1rem'}}>
                                        <InterestIcon fixedWidth={true}/>&nbsp;
                                        <FixtureDisplay value={team.team.interests} fixture={interests}/>
                                    </div>
                                }
                                <div style={{ marginBottom: '1rem' }}>
                                    <LanguageIcon fixedWidth={true}/>&nbsp;
                                    <FixtureDisplay value={team.team.languages} fixture={languages}/>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <Bio bio={team.team.bio} id={team.team.id} />
                                </div>
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
                                                    {teamMember.player.username}
                                                    {teamMember.position && `- ${positions.items[teamMember.position].name}`}
                                                </Label>
                                            </Link>
                                        </div>

                                    ))}
                                </div>
                                <div style={{ marginTop: '1rem' }}>
                                    Last updated {moment(team.team.updated).format('L')}
                                </div>
                            </Col>
                        </Row>
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
