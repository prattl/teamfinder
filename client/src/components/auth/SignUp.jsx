import React, { Component } from 'react'

import { Col, Row } from 'react-bootstrap'
import SignUpForm from 'components/forms/SignUpForm'

class SignUp extends Component {

    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <Row>
                    <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
                        <SignUpForm />
                    </Col>
                </Row>
            </div>
        )
    }

}

export default SignUp
