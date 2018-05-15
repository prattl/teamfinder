import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import AlertSystem from 'react-s-alert'
import {
    Alert,
    Button,
    Col,
    Grid,
    Row,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { openFeedbackForm } from 'actions/feedback'
import TopNav from 'components/layout/TopNav'
import Footer from 'components/layout/Footer'
import FeedbackButton from 'components/feedback/FeedbackButton'
import FeedbackModal from 'components/feedback/FeedbackModal'

const leagueSiteLink = 'https://wepickheroes.com/'

class LeagueAlert extends Component {
    // storageKey = 'hideWPHLeagueAlert'
    storageKey = 'hideWPHTournamentAlert'
    storageValue = '1'

    state = {
        show: false,
    }

    handleDismiss = () => {
        localStorage.setItem(this.storageKey, this.storageValue)
        this.setState({ show: false })
    }

    handleFeedbackClick = e => {
        e.preventDefault()
        this.props.onClick()
    }

    componentDidMount() {
        const hideSurveyAlert = localStorage.getItem(this.storageKey) === this.storageValue
        if (!hideSurveyAlert) {
            this.setState({ show: true })
        }
    }

    render() {
        const { show } = this.state
        const linkProps = { href: leagueSiteLink, target: '_blank' }
        const externalIcon = <i className='fa fa-external-link' />
        const link = (
            <strong><a {...linkProps} className='alert-link'>
                We Pick Heroes&nbsp;{externalIcon}
            </a></strong>
        )
        return show && (
            <Row>
                <Col md={8} mdOffset={2}>
                    <Alert onDismiss={this.handleDismiss} bsStyle='info'
                           style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>
                        <h4>Looking for an amateur Dota 2 tournament?</h4>
                        <p style={{ marginTop: '2rem' }}>
                            The {link} June Amateur League is now open for registration!
                        </p>
                        <ul style={{ marginTop: '1rem' }}>
                            <li>$175 prize pool, double-elimination bracket</li>
                            <li>
                                Open qualifiers start on <strong>May 26</strong> at {' '}
                                <strong>12:00pm PST</strong> / <strong>3:00pm EST</strong>
                            </li>
                            <li>Main event will go from <strong>June 2 - June 17</strong></li>
                        </ul>
                        <p style={{ marginTop: '1rem' }}>
                            If you are looking to bring your team to the next level of competition, head on
                            over &mdash; registration is open!
                        </p>
                        {/*<p style={{ marginTop: '2rem' }}>*/}
                            {/*We are partnered with {link},*/}
                            {/*a new competitive amateur Dota 2 league. If you are looking to bring your team to the*/}
                            {/*next level of competition, head on over &mdash; registration is open!*/}
                        {/*</p>*/}
                        <p style={{ marginTop: '2rem' }} className='text-center'>
                            <Button bsStyle='info' {...linkProps}>
                                Go to wepickheroes.com&nbsp;{externalIcon}
                            </Button>
                            <Button bsStyle='link' onClick={this.handleDismiss}>
                                <span className='text-info'>
                                    Hide
                                </span>
                            </Button>
                        </p>
                    </Alert>
                    <p className='text-muted' style={{ marginBottom: '0' }}>
                        <small>Want to see your tournament or league listed here?{' '}
                        <a href='' onClick={this.handleFeedbackClick}>
                            Let us know
                        </a>.</small>
                    </p>
                </Col>
            </Row>
        )
    }
}

LeagueAlert = connect(null, {
    onClick: openFeedbackForm
})(LeagueAlert)

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
                        <LeagueAlert />
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
