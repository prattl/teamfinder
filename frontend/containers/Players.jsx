import React, { Component } from 'react'
import { connect } from 'react-redux'

import PlayerSearchForm from 'components/forms/PlayerSearchForm'

import 'styles/players.sass'

class Players extends Component {

    render() {
        return (
            <div className='pure-g'>
                <div className='pure-u-md-1'>
                    <h1>Players</h1>
                    <PlayerSearchForm />
                </div>
            </div>
        )
    }

}

export default connect(state => state.players)(Players)
