import React, { Component } from 'react'
import { Helmet } from 'react-helmet'

import AlertSystem from 'react-s-alert'
import {
    Alert,
    Button,
    Col,
    Grid,
    Row,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import TopNav from 'components/layout/TopNav'
import Footer from 'components/layout/Footer'
import FeedbackButton from 'components/feedback/FeedbackButton'
import FeedbackModal from 'components/feedback/FeedbackModal'

const surveyLink = 'https://docs.google.com/forms/d/e/1FAIpQLSeIvtZYRnAiUo0Cq5jHK_z_RD53apj7VW-TaboFAUn0TTgzrg/viewform'

class SurveyAlert extends Component {
    storageKey = 'hideSurveyAlert'
    storageValue = '1'

    state = {
        show: false,
    }

    handleDismiss = () => {
        localStorage.setItem(this.storageKey, this.storageValue)
        this.setState({ show: false })
    }

    componentDidMount() {
        const hideSurveyAlert = localStorage.getItem(this.storageKey) === this.storageValue
        if (!hideSurveyAlert) {
            this.setState({ show: true })
        }
    }

    render() {
        const { show } = this.state
        return show && (
            <Row>
                <Col md={8} mdOffset={2}>
                    <Alert onDismiss={this.handleDismiss} bsStyle='info' style={{ marginTop: '2rem' }}>
                        <h4>We need your help!</h4>
                        <p>
                            We are planning out some big changes and would love to get your feedback. We've
                            created a survey for amatuer Dota 2 players. It would be a huge help if you could fill it
                            out. Thanks!
                        </p>
                        <p>
                            <Button bsStyle='info' href={surveyLink}>Click here to take survey</Button>
                            <Button bsStyle='link' onClick={this.handleDismiss}>
                                <span className='text-info'>
                                    Hide
                                </span>
                            </Button>
                        </p>
                    </Alert>
                </Col>
            </Row>
        )
    }
}

class Base extends Component {



    render() {
        return (
            <div id='page-wrapper'>
                <Helmet>
                    <title>Dota 2 Team Finder</title>
                    <meta name="description" content="The Dota Team Finder is the easiest way to find your next Dota team." />
                </Helmet>

                <TopNav loggedIn={false} location={this.props.location.pathname}/>

                <div id='page-content'>
                    <Grid>
                        <SurveyAlert />

                        {this.props.children}
                    </Grid>
                </div>

                <Footer />
                <AlertSystem stack={{limit: 3}} effect='slide' />
                <FeedbackButton />
                <FeedbackModal />
            </div>
        )
    }

}
export default Base
