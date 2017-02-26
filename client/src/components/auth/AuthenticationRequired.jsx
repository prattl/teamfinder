import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { requestAuthStatus } from 'actions/auth'
import { authSelector } from 'utils/selectors'

const requireAuthentication = (WrappedComponent) => {

    class AuthenticatedComponent extends Component {

        componentDidMount() {
            this.props.onLoad()
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.lastUpdated && !nextProps.tokenVerified) {
                browserHistory.push('/login')
            }
        }

        render() {
            // this.props.lastUpdated && this.props.tokenVerified
            return <WrappedComponent {...this.props} />
        }

    }

    AuthenticatedComponent = connect(
        authSelector,
        { onLoad: requestAuthStatus }
    )(AuthenticatedComponent)
    return AuthenticatedComponent

}

export default requireAuthentication
