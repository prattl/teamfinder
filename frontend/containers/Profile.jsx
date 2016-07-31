import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router-redux'

import { fetchBracketOptions, fetchPlayerInfo} from '../actions/profile'
import ProfileForm from '../components/forms/ProfileForm'

export default class Profile extends Component {

    componentDidMount() {
        //this.props.dispatch(fetchBracketOptions())
    }

    render() {
        const { bracketOptions, isLoading } = this.props
        return (
            <div className='pure-g'>
                <div className='pure-u-md-1-3'></div>
                <div className='pure-u-1 pure-u-md-1-3'>
                    <h1>Profile</h1>
                    <ProfileForm {...this.props} />
                </div>
            </div>
        )
    }

}


export default connect(state => state.profile)(Profile)