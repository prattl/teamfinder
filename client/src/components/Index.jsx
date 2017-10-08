import React, { Component } from 'react'

import { Button, ButtonToolbar, Col, Jumbotron, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

import FeedbackButton from 'components/feedback/FeedbackButton'

import splash from 'images/splash.png'

const todo = <i className='fa fa-square' />
const todoComplete = <i className='fa fa-check-square' />

const FeatureListItem = ({ children, complete=false, extra=null }) => (
    <li>
        {complete ? todoComplete : todo}&nbsp;
        {complete ? <span>{children}</span> : <span>{children}</span>}
        {extra && <span>&nbsp;{extra}</span>}
    </li>
)
const openDotaLink = <a href='https://www.opendota.com/' target='_blank' rel='external'>OpenDota</a>

const RecentUpdates = () => (
    <ul className='list-unstyled' style={{ marginLeft: '2rem' }}>
        <FeatureListItem complete={true}>Sign in with Steam</FeatureListItem>
        <FeatureListItem complete={true}>Email notifications</FeatureListItem>
        <FeatureListItem complete={true}>Add Friend and View Steam Profile Links added</FeatureListItem>
        <FeatureListItem complete={true} extra={<span>(thanks {openDotaLink}!)</span>}>
            Confirm MMR
        </FeatureListItem>
        <FeatureListItem complete={true}>
            Player and team interests (competitive, casual, battle cup, etc.)
        </FeatureListItem>
        <FeatureListItem complete={true}>Language preferences</FeatureListItem>
        <FeatureListItem complete={true}>Player bios</FeatureListItem>
        <FeatureListItem complete={true}>Team bios and logo upload</FeatureListItem>
    </ul>
)

const ComingSoon = () => (
    <ul className='list-unstyled' style={{ marginLeft: '2rem' }}>
        <FeatureListItem complete={false}>Complete redesign</FeatureListItem>
        <FeatureListItem complete={false}>Send messages to your team and recruits</FeatureListItem>

        <FeatureListItem complete={false}>Timezone preferences</FeatureListItem>
        <FeatureListItem complete={false}>Automated matching / recommendations</FeatureListItem>
        <FeatureListItem complete={false}>Verify players</FeatureListItem>
        <FeatureListItem>Schedule team events</FeatureListItem>
        <FeatureListItem>Scrim against other teams</FeatureListItem>
    </ul>
)

class Index extends Component {

    render() {
        return (
            <div>
                <Jumbotron className='text-center' style={{ backgroundImage: `url(${splash})`, backgroundSize: 'cover' }}>
                    <h1>Introducing the Dota 2 Team Finder</h1>
                    <p>
                        Find your next competitive Dota 2 team, or recruit players!
                    </p>
                    <ButtonToolbar style={{ display: 'inline-block' }}>
                        <LinkContainer to='/teams'>
                            <Button bsStyle='info' bsSize='lg'>Find Teams</Button>
                        </LinkContainer>
                        <LinkContainer to='/players'>
                            <Button bsStyle='success' bsSize='lg'>Find Players</Button>
                        </LinkContainer>
                    </ButtonToolbar>
                </Jumbotron>

                <p className='lead'>
                    The Dota 2 Team Finder is the easiest way to find your next Dota team. Unlike other eSports
                    team-finder sites, we are only focused on matching players for Dota 2.
                </p>

                <Row>
                    <Col md={6}>
                        <h3>How it Works</h3>
                        <p>
                            Getting started is easy. Within minutes you can apply to join a team, or create your own team
                            and invite players. Here's how it works:
                        </p>
                        <ol>
                            <li>Sign in with Steam</li>
                            <li>Complete your player profile</li>
                            <li>If you're looking for a team, click <Link to='/teams'>Find Teams</Link> and apply.</li>
                            <li>If you want to create your own team, click <Link to='/players'>Find Players</Link> and invite them to apply.</li>
                        </ol>
                        <p className='text-info'>
                            <i className='fa fa-info-circle'/>&nbsp;If you just want to browse, no sign in is required!
                        </p>
                    </Col>
                    <Col md={6}>
                        <h3>Alpha Release</h3>
                        <p>
                            This is the alpha release of the Dota 2 Team Finder. Feedback is greatly appreciated - you can
                            use the <FeedbackButton inline={true} /> button to submit feedback on any page.
                        </p>
                        <h4>Recent Updates:</h4>
                        <RecentUpdates/>
                        <h4>Coming Soon:</h4>
                        <ComingSoon/>
                    </Col>
                </Row>
            </div>
        )
    }

}

export default Index
