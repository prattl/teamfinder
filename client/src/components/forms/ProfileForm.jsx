import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitProfile } from 'actions/player'

import { Alert, Button } from 'react-bootstrap'
import { createInput, createTextArea, createSelectInput, InterestSelect, LanguageSelect, RegionSelect,
    PositionSelect } from 'components/forms'

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

const validate = values => {
    const errors = {}
    const requiredFields = ['email', 'regions', 'positions', 'interests', ]
    const multiSelectFields = ['regions', 'positions', 'interests', ]
    requiredFields.forEach(fieldName => {
        if ([null, undefined, ''].includes(values[fieldName])) {
            errors[fieldName] = 'Required'
        }
    })
    multiSelectFields.forEach(fieldName => {
        const value = values[fieldName]
        if (value && value.length < 1) {
            errors[fieldName] = 'Required'
        }
    })
    if (values.bio.length > 255) {
        errors.bio = 'Must 255 characters or less.'
    }
    return errors
}

const EmailInput = createInput({
    label: 'Email', type: 'email', helpText: 'Your email is private and will not be shared with anyone. We\'ll use ' +
    'it to let you know when you\'ve been invited or accepted to a team. You can change your email preferences from ' +
    'your settings.'
})
const BioInput = createTextArea({
    label: 'Bio', maxLength: 255,
})
const InterestInput = createSelectInput('Interests', InterestSelect)
const LanguageInput = createSelectInput('Languages', LanguageSelect)
const RegionInput = createSelectInput('Regions', RegionSelect)
const PositionInput = createSelectInput('Positions', PositionSelect)

class ProfileForm extends Component {

    render() {
        const { error, handleSubmit, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='email' component={EmailInput} />
                </div>
                <div>
                    <Field name='regions' component={RegionInput} />
                </div>
                <div>
                    <Field name='positions' component={PositionInput} />
                </div>
                <div>
                    <Field name='interests' component={InterestInput} />
                </div>
                <div>
                    <Field name='languages' component={LanguageInput} />
                </div>
                <div>
                    <Field name='bio' component={BioInput} />
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
    validate,
    onSubmit: submit
})(ProfileForm)

export default ProfileForm
