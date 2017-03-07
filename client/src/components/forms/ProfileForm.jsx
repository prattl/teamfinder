import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitProfile } from 'actions/player'

import { Alert, Button } from 'react-bootstrap'
import { createInput, createSelectInput, RegionSelect, SkillBracketSelect, PositionSelect } from 'components/forms'

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
    const fields = ['username', 'regions', 'skill_bracket', 'positions']
    const multiSelectFields = ['regions', 'positions']
    fields.forEach(fieldName => {
        if ([null, undefined, ''].includes(values[fieldName])) {
            errors[fieldName] = 'Required'
        }
    })
    multiSelectFields.forEach(fieldName => {
        if (values[fieldName].length < 1) {
            errors[fieldName] = 'Required'
        }
    })
    return errors
}

const UsernameInput = createInput('Username')
const RegionInput = createSelectInput('Region', RegionSelect)
const SkillBracketInput = createSelectInput('Skill Bracket', SkillBracketSelect)
const PositionInput = createSelectInput('Positions', PositionSelect)

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
                    <Field name='regions' component={RegionInput} />
                </div>
                <div>
                    <Field name='skill_bracket' component={SkillBracketInput} />
                </div>
                <div>
                    <Field name='positions' component={PositionInput} />
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
