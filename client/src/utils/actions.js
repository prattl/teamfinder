import React, { Component } from 'react'
import Alert from 'react-s-alert'

class ChangesSavedNotification extends Component {
    render() {
        const { message } = this.props
        return (
            <span style={{ fontWeight: 'bold' }}><i className='fa fa-check'/>&nbsp;{message}</span>
        )
    }
}
export const notify = (response, message='Changes saved!') => response.ok && (
    Alert.success(<ChangesSavedNotification message={message} />)
)
