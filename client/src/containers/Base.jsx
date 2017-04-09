import React, { Component } from 'react'

import Alert from 'react-s-alert';
import { Grid } from 'react-bootstrap'
import TopNav from 'components/layout/TopNav'
import Footer from 'components/layout/Footer'
import FeedbackButton from 'containers/FeedbackButton'

class Base extends Component {

    render() {
        return (
            <div id='page-wrapper'>
                <TopNav loggedIn={false} location={this.props.location.pathname}/>

                <div id='page-content'>
                    <Grid>
                        {this.props.children}
                    </Grid>
                </div>

                <Footer />
                <Alert stack={{limit: 3}} effect='slide' />
                <FeedbackButton />
            </div>
        )
    }

}
export default Base
