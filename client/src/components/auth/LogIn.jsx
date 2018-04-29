import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Col, Row } from 'react-bootstrap'

import LogInForm from 'components/forms/LogInForm'

class LogIn extends Component {

    static PropTypes = {
        alertRequired: PropTypes.boolean
    }

    static defaultProps = {
        alertRequired: false
    }

    render() {
        const { alertRequired } = this.props
        return (
            <div>
                <h1>Log In</h1>
                <Row>
                    <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
                        {alertRequired && <Alert bsStyle='danger'>You must be logged in to access this page.</Alert>}
                        <LogInForm />
                    </Col>
                </Row>
            </div>
        )
    }

}

export default LogIn
