import React, { Component } from 'react'
// import { connect } from 'react-redux'

import { Grid } from 'react-bootstrap'
import TopNav from 'components/layout/TopNav'
import Footer from 'components/layout/Footer'


class Base extends Component {

    render() {
        // const { authToken, tokenVerified } = this.props.auth
        // const { pathname } = this.props.location
        return (
            <div id='page-wrapper'>
                <TopNav loggedIn={false}/>

                <div id='page-content'>
                    <Grid>
                        {this.props.children}
                    </Grid>
                </div>

                <Footer />
            </div>
        )
    }

}
export default Base
// export default connect(state => state)(Base)
