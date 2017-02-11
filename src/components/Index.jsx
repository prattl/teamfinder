import React, { Component, PropTypes } from 'react'
import { Button, ButtonToolbar, Jumbotron } from 'react-bootstrap'


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
                        <Button bsStyle='primary'>Find Teams</Button>
                        <Button bsStyle='primary'>Find Players</Button>
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
            </div>
        )
    }

}

export default Index
