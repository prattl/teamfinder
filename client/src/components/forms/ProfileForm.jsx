import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitProfile } from 'actions/player'

import { Alert, Button } from 'react-bootstrap'
import { createInput } from 'components/forms'

const submit = (values, dispatch) => {
    return dispatch(submitProfile(values)).then(({ response, json }) => {
        if (!response.ok) {
            const errors = {}
            if (json.hasOwnProperty('non_field_errors')) {
                errors._error = json.non_field_errors[0]
            }
            throw new SubmissionError(errors)
        }
    })
}

const UsernameInput = createInput('Username')

class ProfileForm extends Component {

    render() {
        const { error, handleSubmit, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='username' component={UsernameInput} />
                </div>
                <div>
                    <Button type='submit' disabled={submitting}>
                        Save Changes
                    </Button>
                </div>
            </form>
        )
    }
}


ProfileForm = reduxForm({
    form: 'profile',
    onSubmit: submit
})(ProfileForm)

export default ProfileForm
