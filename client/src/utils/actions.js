import React, { Component } from 'react'
import Alert from 'react-s-alert'

class ChangesSavedNotification extends Component {
    render() {
        return (
            <span style={{ fontWeight: 'bold' }}><i className='fa fa-check'/>&nbsp;Changes Saved!</span>
        )
    }
}
export const notify = response => response.ok && Alert.success(<ChangesSavedNotification />)
