import React, { Component, PropTypes } from 'react'

import { withPlayer } from 'components/connectors/WithPlayer'

class PlayerName extends Component {

    static propTypes = {
        playerId: PropTypes.string.isRequired
    }

    render() {
        const { selectedPlayer } = this.props
        return <span>{selectedPlayer.username}</span>
    }

}

PlayerName = withPlayer(props => props.playerId)(PlayerName)

export default PlayerName
