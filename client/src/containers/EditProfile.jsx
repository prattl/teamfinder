import React, { Component } from 'react'
import { connect } from 'react-redux'

import { requestOwnPlayerIfNeeded } from 'actions/player'
import { playerSelector } from 'utils/selectors'

import { Col, Image, Row } from 'react-bootstrap'
import requireAuthentication from 'components/auth/AuthenticationRequired'
import ProfileForm from 'components/forms/ProfileForm'

class EditProfile extends Component {

    componentDidMount() {
        this.props.onLoad()
    }

    render() {
        const { player } = this.props
        const initialValues = player ? {
            username: player.username
        } : {}
        return (
            <div>
                <h1>Profile</h1>
                <Row>
                    <Col lg={4} md={3} sm={2}>

                    </Col>
                    <Col lg={4} md={6} sm={8}>
                        {player && <ProfileForm initialValues={initialValues} />}
                    </Col>
                </Row>

            </div>
        )
    }

}

EditProfile = connect(
    playerSelector,
    { onLoad: requestOwnPlayerIfNeeded }
)(EditProfile)

EditProfile = requireAuthentication(EditProfile)

export default EditProfile
