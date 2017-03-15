import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { inviteToTeam } from 'actions/playerSearch'

import { Alert } from 'react-bootstrap'

const submit = (values, dispatch) => {
    return dispatch(inviteToTeam(values)).then(({ response, json }) => {
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

    return errors
}

class InvitationForm extends Component {

    render() {
        const { error, handleSubmit } = this.props
        return (
            <form onSubmit={handleSubmit}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='player' component='input' type='hidden' />
                </div>
                <div>
                    <Field name='team' component='input' type='hidden' />
                </div>
                <div>
                    <Field name='position' component={PositionInput} />
                </div>
            </form>
        )
    }
}


InvitationForm = reduxForm({
    form: 'invitation',
    validate,
    onSubmit: submit
})(InvitationForm)

export default InvitationForm
