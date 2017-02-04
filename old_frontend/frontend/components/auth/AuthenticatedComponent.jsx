import React from 'react'
import { connect } from 'react-redux'


export default function requireAuthentication(Component) {

    class AuthenticatedComponent extends React.Component {

        componentWillReceiveProps(nextProps) {
            if (nextProps.lastUpdated && !nextProps.tokenVerified) {
                this.context.router.push('/login')
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

    AuthenticatedComponent.contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    return connect(state => state.auth)(AuthenticatedComponent)
}
