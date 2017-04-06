import React, { Component } from 'react'
import { connect } from 'react-redux'

// import { requestAllFixtures } from 'actions/fixtures'
import TeamSearchForm from 'components/forms/TeamSearchForm'
import TeamSearchResults from 'containers/teams/TeamSearchResults'

class TeamSearch extends Component {

    componentDidMount() {
        // Testing only
        // this.props.requestAllFixtures()
    }

    render() {
        return (
            <div>
                <h1>Teams</h1>
                <TeamSearchForm />
                <TeamSearchResults />
            </div>
        )
    }

}

TeamSearch = connect(
    () => ({}),
    // { requestAllFixtures }
)(TeamSearch)

export default TeamSearch
