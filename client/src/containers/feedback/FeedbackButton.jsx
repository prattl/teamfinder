import React, { Component } from 'react'
import { connect } from 'react-redux'

import { openFeedbackForm } from 'actions/feedback'

class FeedbackButton extends Component {

    render() {
        const { onClick } = this.props
        return (
            <div id='feedback-button' onClick={() => onClick()}>
                <strong>Submit Feedback</strong> <i>(alpha)</i>
            </div>
        )
    }

}
FeedbackButton = connect(null, {
    onClick: openFeedbackForm
})(FeedbackButton)
export default FeedbackButton
