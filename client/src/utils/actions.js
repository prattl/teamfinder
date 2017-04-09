import React, { Component } from 'react'
import Alert from 'react-s-alert'

class ChangesSavedNotification extends Component {
    static defaultProps = {
        message: 'Changes Saved!'
    }
    render() {
        const { message } = this.props
        return (
            <span style={{ fontWeight: 'bold' }}><i className='fa fa-check'/>&nbsp;{message}</span>
        )
    }
}
export const notify = (response, message=null) => response.ok && (
    Alert.success(<ChangesSavedNotification message={message} />)
)
