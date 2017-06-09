import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestPlayer } from 'actions/playerSearch'
import { playersSelector } from 'utils/selectors'

const _withPlayer = playerId => (WrappedComponent) => {
    class WithPlayer extends Component {

        componentDidMount() {
            this.props.onLoad(playerId)
        }

        render() {
            const { players } = this.props
            const player = players[playerId] || {}
            return <WrappedComponent selectedPlayer={player} {...this.props} />
        }

    }
    WithPlayer = connect(playersSelector, { onLoad: requestPlayer })(WithPlayer)
    return WithPlayer
}

export const withPlayer = mapPropsToId => WrappedComponent => {

    class WithPlayer extends Component {

        constructor(props) {
            super(props)
            this.state = {
                ConnectedComponent: null
            }
            this.updateConnectedComponent = this.updateConnectedComponent.bind(this)
        }

        updateConnectedComponent() {
            this.setState({ ConnectedComponent: _withPlayer(mapPropsToId(this.props))(WrappedComponent)})
        }

        componentWillMount() {
            this.updateConnectedComponent()
        }

        componentDidUpdate(prevProps) {
            const { params } = this.props
            const { params: prevParams } = prevProps
            if (params && prevParams) {
                const { id } = params
                const { id: prevId } = prevParams
                if (id !== prevId) {
                    this.updateConnectedComponent()
                }
            }

        }

        render() {
            const { ConnectedComponent } = this.state
            return <ConnectedComponent {...this.props} />
        }
    }

    return WithPlayer
}
