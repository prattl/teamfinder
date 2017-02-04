import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router-redux'

import TeamForm from '../components/forms/TeamForm'

export default class CreateTeam extends Component {

    render() {
        return (
            <div className='pure-g'>
                <div className='pure-u-md-1-3'></div>
                <div className='pure-u-1 pure-u-md-1-3'>
                    <h1>Create a Team</h1>
                    <TeamForm {...this.props} />
                </div>
            </div>
        )
    }

}

export default connect(state => ({profile: state.profile, memberships: state.memberships}))(CreateTeam)