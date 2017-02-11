import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestAllFixtures } from 'actions/fixtures'
import PlayerSearchForm from 'components/forms/PlayerSearchForm'
// import PlayerSearchResults from 'containers/PlayerSearchResults'

class PlayerSearch extends Component {

    componentDidMount() {
        // Testing only
        this.props.requestAllFixtures()
    }

    render() {
        return (
            <div>
                <h1>Players</h1>
                <PlayerSearchForm />
                {/*<PlayerSearchResults />*/}
            </div>
        )
    }

}

PlayerSearch = connect(
    () => ({}),
    { requestAllFixtures }
)(PlayerSearch)

export default PlayerSearch
