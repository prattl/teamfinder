import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router-redux'

const requireAuthentication = (Component) => {

    class AuthenticatedComponent extends React.Component {

        componentDidMount() {
            this.props.onLoad()
        }

        componentWillReceiveProps(nextProps) {
            if (nextProps.lastUpdated && !nextProps.tokenVerified) {
                browserHistory.push('/login')
            }
        }

        render() {
            return (
                <div>
                    {this.props.lastUpdated && this.props.tokenVerified &&
                        <Component {...this.props} />
                    }
                </div>
            )
        }

    }

    AuthenticatedComponent = connect(
        state => state.auth,
        { onLoad: requestAuthStatus }
    )(AuthenticatedComponent)
    return AuthenticatedComponent

}

export default requireAuthentication
