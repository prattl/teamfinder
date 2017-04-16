import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setAuthTokenFromSteamSignIn } from 'actions/auth'

class FinishSteamSignIn extends Component {

    componentDidMount() {
        console.log('Finish steam mount')
        const { params: { token } } = this.props
        this.props.onLoad(token)
    }

    render() {
        return (
            <div>

            </div>
        )
    }

}

FinishSteamSignIn = connect(null, { onLoad: setAuthTokenFromSteamSignIn })(FinishSteamSignIn)

export default FinishSteamSignIn
