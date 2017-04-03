import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { withPlayer } from 'components/connectors/WithPlayer'

class PlayerName extends Component {

    static propTypes = {
        playerId: PropTypes.string.isRequired
    }

    render() {
        const { playerId, player } = this.props
        return <span>{player.username}</span>
    }

}

PlayerName = withPlayer(props => props.playerId)(PlayerName)

export default PlayerName
