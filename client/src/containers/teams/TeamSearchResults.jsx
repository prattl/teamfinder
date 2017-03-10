import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { submit } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { requestTeamSearch, requestNextPageOfTeams } from 'actions/teamSearch'
import { teamSearchSelector } from 'utils/selectors'

class TeamSearchResults extends PureComponent {

    constructor(props) {
        super(props)
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
        console.log('PROPS: ', this.props)
    }

    componentDidMount() {
        this.props.submit('teamSearch')
    }

    handleRefreshClick(e) {
        e.preventDefault()
        this.props.submit('teamSearch')
    }

    render() {
        const a = this.props
        console.log('PROPS: ', a)
        return (
            <div>
                <h1>heyyy</h1>
            </div>
        )
    }

}

TeamSearchResults = connect(
    createStructuredSelector({
        teamSearch: teamSearchSelector,
    }),
    { requestTeamSearch, requestNextPageOfTeams, submit }
)(TeamSearchResults)

export default TeamSearchResults
