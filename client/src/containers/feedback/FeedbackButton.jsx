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
        const props = inline ? { bsSize: 'xs' } : {}
        return (
            <Button id='feedback-button' className={!inline && 'fixed'}
                    bsStyle='warning' onClick={() => onClick()} {...props}>
                <strong>Submit Feedback</strong> <i>(alpha)</i>
            </Button>
        )
    }

}
FeedbackButton = connect(null, {
    onClick: openFeedbackForm
})(FeedbackButton)
export default FeedbackButton
