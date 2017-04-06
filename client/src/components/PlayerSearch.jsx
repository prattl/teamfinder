import React, { Component } from 'react'

import PlayerSearchForm from 'components/forms/PlayerSearchForm'
import PlayerSearchResults from 'containers/PlayerSearchResults'

class PlayerSearch extends Component {

    render() {
        return (
            <div>
                <h1>Players</h1>
                <PlayerSearchForm />
                <PlayerSearchResults />
            </div>
        )
    }

}

export default PlayerSearch
