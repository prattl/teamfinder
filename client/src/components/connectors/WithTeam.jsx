import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { requestTeam } from 'actions/teams'
import { teamsSelector } from 'utils/selectors'

export const withTeam = teamId => (WrappedComponent) => {

    class WithTeam extends Component {

        componentDidMount() {
            this.props.onLoad(teamId)
        }

        render() {
            const { teams } = this.props
            const team = teams[teamId] || {}

            return <WrappedComponent team={team} {...this.props} />
        }

    }
    WithTeam = connect(
        teamsSelector,
        { onLoad: requestTeam }
    )(WithTeam)
    return WithTeam
}

export const withTeamFromParams = WrappedComponent => props => {
    const ConnectedComponent = withTeam(props.params.id)(WrappedComponent)
    return <ConnectedComponent />
}
