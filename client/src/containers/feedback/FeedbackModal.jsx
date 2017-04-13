import React, { Component } from 'react'
import { connect } from 'react-redux'
import { submit } from 'redux-form'

import { closeFeedbackForm } from 'actions/feedback'
import { feedbackSelector } from 'utils/selectors'

import { Button, Modal } from 'react-bootstrap'
import FeedbackForm from 'components/forms/FeedbackForm'

class FeedbackModal extends Component {
    render() {
        const { feedbackFormOpen, onClose } = this.props
        return (
            <Modal show={feedbackFormOpen}>
                <Modal.Header closeButton onHide={onClose}>
                    <Modal.Title>Submit Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FeedbackForm />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onClose} bsStyle='link'>Cancel</Button>
                    <Button bsStyle='success' onClick={() => this.props.submit('feedback')}>Submit</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

FeedbackModal = connect(
    feedbackSelector,
    {
        onClose: closeFeedbackForm,
        submit
    }
)(FeedbackModal)

export default FeedbackModal
