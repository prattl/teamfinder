import React, { Component } from 'react'
// import { connect } from 'react-redux'

import { Col, Row } from 'react-bootstrap'
import LogInForm from 'components/forms/LogInForm'

class LogIn extends Component {
    render() {
        return (
            <Row>
                <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
                    <LogInForm />
                </Col>
            </Row>
        )
    }
}

export default LogIn
