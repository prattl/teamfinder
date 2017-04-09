import React, { Component } from 'react'
import { Button, ButtonToolbar, Jumbotron } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

class Index extends Component {

    render() {
        return (
            <div>
                <Jumbotron>
                    <h1>Dota 2 Team Finder</h1>
                    <p>
                        Find your next competetive Dota 2 team, or recruit players!
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

                <h2>How it Works</h2>
                <p>
                    Looking for a competitive Dota 2 team? Sign in, create a profile, and start searching for teams.
                </p>
                <p>
                    Looking for players to round out your roster? Sign in, create a team with the positions you
                    need to fill. Then start searching for players.
                </p>
                <p>
                    If you just want to browse, no sign in is required!
                </p>

                <h3>Alpha Release</h3>
                <p>
                    This is the alpha release of the Dota 2 teamfinder. Feedback is greatly appreciated - you can
                    use the form in the lower right to submit feedback on any page.
                </p>
                <p>
                    This website is still a work in progress. Below is a list of features that are currently planned:
                </p>
                <ul>
                    <li>Feature request voting system (so we know what features the community wants most)</li>
                    <li>Sign in with Steam</li>
                    <li>Verify / confirm players</li>
                    <li>Add player and team interests (competitive, casual, battle cup, etc.)</li>
                    <li>Password reset</li>
                </ul>
            </div>
        )
    }

}

export default Index
