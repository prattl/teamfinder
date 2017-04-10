import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Button } from 'react-bootstrap'
import { openFeedbackForm } from 'actions/feedback'

class FeedbackButton extends Component {

    static defaultProps = {
        inline: false
    }

    render() {
        const { onClick, inline } = this.props
        return (
            <Button id='feedback-button' className={!inline && 'fixed'}
                    bsStyle='warning' bsSize={inline ? 'xs' : 'lg'}
                    onClick={() => onClick()}>
                <strong>Submit Feedback</strong> <i>(alpha)</i>
            </Button>
        )
    }

}
FeedbackButton = connect(null, {
    onClick: openFeedbackForm
})(FeedbackButton)
export default FeedbackButton
