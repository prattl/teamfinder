import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap'

import PlayerSearchForm from 'components/forms/PlayerSearchForm'
import PlayerSearchResults from 'components/PlayerSearchResults'

class PlayerSearch extends Component {

    render() {
        return (
            <div>
                <h1>Players</h1>
                <Row>
                    <Col md={3}>
                        <PlayerSearchForm />
                    </Col>
                    <Col md={9}>
                        <PlayerSearchResults />
                    </Col>
                </Row>


            </div>
        )
    }

}

export default PlayerSearch
