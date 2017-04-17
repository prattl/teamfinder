import React, { Component } from 'react'
import { compose } from 'redux'
import { Helmet } from 'react-helmet'

import { withOwnPlayer } from 'components/connectors/WithOwnPlayer'

import requireAuthentication from 'components/auth/AuthenticationRequired'
import EmailPreferencesForm from 'components/forms/EmailPreferencesForm'
import { Loading } from 'utils'

class EditSettings extends Component {
    componentDidMount() {
        this.props.onLoad()
    }

    render() {
        const { userEmailPreferences: { email_preferences }, receivedEmailPreferences, isLoading, lastUpdated } = this.props
        const initialValues = receivedEmailPreferences ? ({
            email_preferences: email_preferences.map(item => ({
                id: item.id, receive: item.receive, tag: item.tag
            }))
        }) : {}
        return (
            <div>
                <Helmet>
                    <title>Edit Settings | Dota 2 Team Finder</title>
                </Helmet>
                <h1>Settings</h1>
                {isLoading ? <Loading /> : (
                    lastUpdated && receivedEmailPreferences ? (
                        <div>
                            <h2>Email Preferences</h2>
                            <EmailPreferencesForm initialValues={initialValues} />
                        </div>
                    ) : (<div>Error</div>)
                )}
            </div>
        )
    }

}

EditSettings = compose(
    withOwnPlayer,
    requireAuthentication
)(EditSettings)

export default EditSettings
