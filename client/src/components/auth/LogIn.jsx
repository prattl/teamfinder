import React, { Component } from 'react'

import { Col, Row } from 'react-bootstrap'
import LogInForm from 'components/forms/LogInForm'

class LogIn extends Component {

    render() {
        return (
            <div>
                <h1>Log In</h1>
                <Row>
                    <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
                        <LogInForm />
                    </Col>
                </Row>
            </div>
        )
    }

}

export default LogIn
