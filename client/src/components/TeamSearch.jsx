import React, { Component } from 'react'

import TeamSearchForm from 'components/forms/TeamSearchForm'
import TeamSearchResults from 'containers/teams/TeamSearchResults'

class TeamSearch extends Component {

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

export default TeamSearch
