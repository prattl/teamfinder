import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestOwnPlayerIfNeeded } from 'actions/player'
import { playerSelector } from 'utils/selectors'

export const withOwnPlayer = (WrappedComponent) => {
    class WithOwnPlayer extends Component {

        componentDidMount() {
            this.props.onLoad()
        }

        render() {
            return <WrappedComponent {...this.props} />
        }

    }
    WithOwnPlayer = connect(playerSelector, { onLoad: requestOwnPlayerIfNeeded })(WithOwnPlayer)
    return WithOwnPlayer
}
