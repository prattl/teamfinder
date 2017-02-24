import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { requestTeam } from 'actions/teams'

import { Loading } from 'utils'
import { teamsSelector } from 'utils/selectors'

class TeamSnippet extends Component {

    static propTypes = {
        teamId: PropTypes.string.isRequired
    }

    componentDidMount() {
        this.props.onLoad()
    }

    render() {
        const { teamId, teams } = this.props
        const thisTeam = teams[teamId] || {}
        const { team=null, isLoading=true, lastUpdated=null } = thisTeam
        return (
            <div style={{ padding: '1rem', margin: '2rem 0', border: '1px solid #DDD' }}>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <h4>{team.name}</h4>
                    ) : null
                )}
            </div>
        )
    }

}

TeamSnippet = connect(
    teamsSelector,
    (dispatch, props) => ({
        onLoad: () => dispatch(requestTeam(props.teamId))
    })
)(TeamSnippet)

export default TeamSnippet
