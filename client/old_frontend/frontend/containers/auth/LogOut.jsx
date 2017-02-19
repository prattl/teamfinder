import React, { Component } from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'

import { logout } from '../../actions/auth'

export default class LogOut extends Component {

    componentDidMount() {
        this.props.dispatch(logout())
    }

    render() {
        return (
            <div className='container-fluid'>
                <div className='pure-g gutter'>
                    <div className='pure-u-md-1-3'></div>
                    <div className='pure-u-1 pure-u-md-1-3'>
                        <div className=''>
                            <h1 className='text-center'>Log Out</h1>
                            <p>Thanks for using the Dota 2 Teamfinder! You wil be redirected shortly.</p>
                        </div>
                    </div>
                    <div className='pure-u-md-1-3'></div>
                </div>
            </div>
        )
    }

}

export default connect(state => state)(LogOut)