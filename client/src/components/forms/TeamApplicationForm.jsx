import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitApplication } from 'actions/player'
import { SinglePositionSelect } from 'components/forms'

import { Alert } from 'react-bootstrap'

const submit = (values, dispatch) => {
    return dispatch(submitApplication(values)).then(({ response, json }) => {
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

// TODO: Limit position options to available team positions
class TeamApplicationForm extends Component {

    render() {
        const { error, handleSubmit } = this.props
        return (
            <form onSubmit={handleSubmit}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='position' component={SinglePositionSelect} />
                </div>
                <div>
                    <Field name='team' component='input' type='hidden' />
                </div>
            </form>
        )
    }
}

TeamApplicationForm = reduxForm({
    form: 'application',
    validate,
    onSubmit: submit,
    initialValues: {
        position: null
    }
})(TeamApplicationForm)

export default TeamApplicationForm
