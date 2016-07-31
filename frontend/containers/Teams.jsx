import React, { Component } from 'react'
import { connect } from 'react-redux'

export default class Teams extends Component {

    render() {
        return (
            <div className='pure-g'>
                <div className='pure-u-md-1'>
                    <h1>Teams</h1>
                </div>
            </div>
        )
    }

}

export default connect(state => state)(Teams)