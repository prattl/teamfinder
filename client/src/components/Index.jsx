import React, { Component } from 'react'

import { Button, ButtonToolbar, Jumbotron } from 'react-bootstrap'
import { Link } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'

import FeedbackButton from 'containers/feedback/FeedbackButton'

const todo = <i className='fa fa-square' />
const todoComplete = <i className='fa fa-check-square' />

const FeatureListItem = ({ children, complete=false }) => (
    <li>{complete ? todoComplete : todo}&nbsp;{complete ? <s>{children}</s> : <span>{children}</span>}</li>
)

class Index extends Component {

    render() {
        return (
            <div>

                <Jumbotron>
                    <h1>Dota 2 Team Finder</h1>
                    <p>
                        Find your next competitive Dota 2 team, or recruit players!
                    </p>
                    <ButtonToolbar>
                        <LinkContainer to='/teams'>
                            <Button bsStyle='primary'>Find Teams</Button>
                        </LinkContainer>
                        <LinkContainer to='/players'>
                            <Button bsStyle='primary'>Find Players</Button>
                        </LinkContainer>
                    </ButtonToolbar>
                </Jumbotron>

                <h2>Introducing the Dota 2 Team Finder</h2>
                <p>
                    The Dota Team Finder is the easiest way to find your next Dota team. Unlike other eSports
                    team-finder websites, we are specifically targeted only to Dota 2.
                </p>

                <h3>How it Works</h3>
                <p>
                    Getting started is easy. Within minutes you can apply to join a team, or create your own team
                    and invite players. Here's how it works:
                </p>
                <ol>
                    <li>Sign in with Steam</li>
                    <li>Create your player profile</li>
                    <li>If you're looking for a team, click <Link to='/teams'>Find Teams</Link> and apply.</li>
                    <li>If you want to create your own team, click <Link to='/players'>Find Players</Link> and invite them to apply.</li>
                </ol>

                <p className='text-info'>
                    <i className='fa fa-info-circle'/>&nbsp;If you just want to browse, no sign in is required!
                </p>

                <h3>Alpha Release</h3>
                <p>
                    This is the alpha release of the Dota 2 Team Finder. Feedback is greatly appreciated - you can
                    use the <FeedbackButton inline={true} /> button to submit feedback on any page.
                </p>
                <p>
                    This website is still a work in progress. Below is a list of features that are currently planned:
                </p>
                <ul className='list-unstyled' style={{ marginLeft: '2rem' }}>
                    <FeatureListItem complete={true}>Sign in with Steam</FeatureListItem>
                    <FeatureListItem complete={true}>Email notifications</FeatureListItem>
                    <FeatureListItem complete={false}>Send messages to your team and recruits</FeatureListItem>
                    <FeatureListItem complete={false}>Player and team bios</FeatureListItem>
                    <FeatureListItem complete={false}>Verify players</FeatureListItem>
                    <FeatureListItem complete={false}>Confirm MMR</FeatureListItem>
                    <FeatureListItem complete={false}>
                        Add player and team interests (competitive, casual, battle cup, etc.)
                    </FeatureListItem>
                    <FeatureListItem>Schedule team events</FeatureListItem>
                    <FeatureListItem>Scrim against other teams</FeatureListItem>
                </ul>
            </div>
        )
    }

}

export default Index
