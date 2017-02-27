import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { signUp } from 'actions/auth'

import { Alert, Button } from 'react-bootstrap'
import { createInput } from 'components/forms'

const submit = (values, dispatch) => {
    return dispatch(signUp(values)).then(({ response, json }) => {
        if (!response.ok) {
            const errors = json
            if (json.hasOwnProperty('non_field_errors')) {
                errors._error = json.non_field_errors[0]
            }
            throw new SubmissionError(errors)
        }
    })
}

const validate = values => {
    const errors = {}
    const fields = ['email', 'password', 'password2']
    fields.map(fieldName => {
        if ([undefined, ''].includes(values[fieldName])) {
            errors[fieldName] = 'Required'
        }
    })

    if (values.password !== values.password2) {
        errors.password = 'Passwords must match.'
    }

    return errors
}

const EmailInput = createInput('Email', 'email')
const PasswordInput = createInput('Password', 'password')
const Password2Input = createInput('Repeat Password', 'password')

class SignUpForm extends Component {

    render() {
        const { error, handleSubmit, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='email' component={EmailInput} />
                </div>
                <div>
                    <Field name='password' component={PasswordInput} />
                </div>
                <div>
                    <Field name='password2' component={Password2Input} />
                </div>
                <div>
                    <Button type='submit' disabled={submitting}>
                        Submit
                    </Button>
                </div>
            </form>
        )
    }
}


SignUpForm = reduxForm({
    form: 'signUp',
    validate,
    onSubmit: submit
})(SignUpForm)

export default SignUpForm
