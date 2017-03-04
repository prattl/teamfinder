import React, { Component } from 'react'
import { connect } from 'react-redux'

import { dismissChangesSaved, requestOwnPlayerIfNeeded } from 'actions/player'
import { playerSelector } from 'utils/selectors'

import { Alert, Col, Image, Row } from 'react-bootstrap'
import requireAuthentication from 'components/auth/AuthenticationRequired'
import ProfileForm from 'components/forms/ProfileForm'

class EditProfile extends Component {

    constructor(props) {
        super(props)
        this.handleChangesSavedDismiss = this.handleChangesSavedDismiss.bind(this)
    }

    handleChangesSavedDismiss() {
        this.props.onDismissChangesSaved()
    }

    componentDidMount() {
        this.props.onLoad()
    }

    render() {
        const { changesSaved, player } = this.props
        const initialValues = player ? ({
            username: player.username,
            skill_bracket: player.skill_bracket,
            positions: player.positions,
            regions: player.regions
        }) : {}
        return (
            <div>
                <h1>Profile</h1>
                <Row>
                    <Col lg={4} md={3} sm={2}>
                        <div className='text-right'>
                            <Image src='http://placehold.it/150x150' thumbnail />
                        </div>
                    </Col>
                    <Col lg={4} md={6} sm={8}>
                        {changesSaved && (
                            <Alert bsStyle='success' onDismiss={this.handleChangesSavedDismiss}>Changes saved!</Alert>
                        )}
                        {player && <ProfileForm initialValues={initialValues} />}
                    </Col>
                </Row>

            </div>
        )
    }

}

EditProfile = connect(
    playerSelector,
    { onLoad: requestOwnPlayerIfNeeded, onDismissChangesSaved: dismissChangesSaved }
)(EditProfile)

EditProfile = requireAuthentication(EditProfile)

export default EditProfile
