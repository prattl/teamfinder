import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { requestTeam } from 'actions/teams'

import { Link } from 'react-router'
import { Label } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { requestPlayer } from 'actions/playerSearch'
import { playerSearchSelector } from 'utils/selectors'
import { FixtureDisplay, Loading } from 'utils'
import { CaptainIcon, RegionIcon, PlayersIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'

class ManageTeam extends Component {

    componentDidMount() {
        this.props.dispatch(requestTeam(this.props.params.id))
    }

    render() {
        const { params: { id }, teams: { teams } } = this.props

        // const id = this.props.params.id
        // const { teams } = this.props.teams
        // if teams[id] is undefined or empty
        const team = teams[id] || {}
        const isLoading = team.isLoading
        const lastUpdated = team.lastUpdated

        // or ...
        // const teams = this.props.teams
        // const team = teams.team
        // const isLoading = teams.isLoading
        // const lastUpdated = teams.lastUpdated

        // const { fixtures: { regions, positions, skillBrackets } } = this.props

        console.log('TEAM: ', team)

        return (
            <div>
                <h1>Manage Team:</h1>
            </div>
        )
    }
}

// higher order component function that takes in a component
ManageTeam = connect(
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
)(ManageTeam)

// ManageTeam = with(ManageTeam)

export default ManageTeam
