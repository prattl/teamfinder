import React, { Component } from 'react'
import { connect } from 'react-redux'

import TopNav from 'components/TopNav'
import Footer from 'components/Footer'


class Base extends Component {

    // componentDidMount() {
    //     this.props.dispatch(fetchPlayerInfo())
    // }

    render() {
        // const { authToken, tokenVerified } = this.props.auth
        // const { pathname } = this.props.location
        return (
            <div id='page-wrapper'>
                <TopNav loggedIn={false}/>

                <div id='page-content'>
                    {this.props.children}
                </div>

                <Footer />
            </div>
        )
    }

}
export default Base
// export default connect(state => state)(Base)
