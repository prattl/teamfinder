import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { requestAuthStatusIfNeeded } from 'actions/auth'
import { authSelector } from 'utils/selectors'

const requireAuthentication = (WrappedComponent) => {

    class AuthenticatedComponent extends Component {

        componentDidMount() {
            this.props.onLoad()
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.lastUpdated && !nextProps.tokenVerified) {
                browserHistory.push('/login-required')
            }
        }

        render() {
            const { tokenVerified } = this.props
            return tokenVerified ? <WrappedComponent {...this.props} /> : null
        }

    }

    AuthenticatedComponent = connect(
        authSelector,
        { onLoad: requestAuthStatusIfNeeded }
    )(AuthenticatedComponent)
    return AuthenticatedComponent

}

export default requireAuthentication
