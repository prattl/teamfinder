import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { dismissChangesSaved, requestOwnPlayerIfNeeded } from 'actions/player'
import { playerSelector } from 'utils/selectors'

import { Alert, Col, Image, Row } from 'react-bootstrap'
import requireAuthentication from 'components/auth/AuthenticationRequired'
import ProfileForm from 'components/forms/ProfileForm'
import { Loading } from 'utils'

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
        const { changesSaved, player, isLoading, lastUpdated } = this.props
        const initialValues = player ? ({
            email: player.email,
            interests: player.interests,
            languages: player.languages,
            positions: player.positions,
            regions: player.regions
        }) : {}
        return (
            <div>
                <Helmet>
                    <title>Edit Profile | Dota 2 Team Finder</title>
                </Helmet>
                <h1>Profile{player.username && `: ${player.username}`}</h1>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <Row>
                            <Col lg={4} md={3} sm={2}>
                                <div className='text-right'>
                                    <Image src={player.avatarfull} thumbnail />
                                </div>
                            </Col>
                            <Col lg={4} md={6} sm={8}>
                                {changesSaved && (
                                    <Alert bsStyle='success' onDismiss={this.handleChangesSavedDismiss}>Changes saved!</Alert>
                                )}
                                {player && <ProfileForm initialValues={initialValues} />}
                            </Col>
                        </Row>
                    ) : (<div>Error</div>)
                )}
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
