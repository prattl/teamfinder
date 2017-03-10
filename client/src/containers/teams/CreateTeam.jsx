import React, { Component } from 'react'
import connect from 'react-redux'

import { Col, Row } from 'react-bootstrap'
import TeamForm from 'components/forms/TeamForm'

class CreateTeam extends Component {
    render() {
        return (
            <div>
                <h1>Create Team</h1>
                <Row>
                    <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
                        <TeamForm />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default CreateTeam
