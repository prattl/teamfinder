import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestOwnPlayerIfNeeded } from 'actions/player'
import { playerSelector } from 'utils/selectors'

export const withPlayer = (WrappedComponent) => {
    class WithPlayer extends Component {

        componentDidMount() {
            this.props.onLoad()
        }

        render() {
            return <WrappedComponent {...this.props} />
        }

    }
    WithPlayer = connect(playerSelector, { onLoad: requestOwnPlayerIfNeeded })(WithPlayer)
    return WithPlayer
}
