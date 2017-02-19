import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'

import { fetchUserDetailsIfNeeded } from 'actions/auth'
import { fetchPlayerInfo } from 'actions/profile'

import TopNav from 'components/TopNav'
import Footer from 'components/Footer'


class Base extends Component {

    componentDidMount() {
        this.props.dispatch(fetchPlayerInfo())
    }

    render() {
        const { authToken, tokenVerified } = this.props.auth
        const { pathname } = this.props.location
        return (
            <div id='react-base'>
                <div id='page-wrapper'>
                    <header id='page-header'>
                        <TopNav loggedIn={Boolean(authToken && tokenVerified)} pathname={pathname} />
                    </header>

                    <div id='page-content'>
                        <div id='header-push'></div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }

}

export default connect(state => state)(Base)
