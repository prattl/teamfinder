import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitFeedbackForm } from 'actions/feedback'
import { createTextArea, createSelect } from 'components/forms'

import { Alert } from 'react-bootstrap'

const submit = (values, dispatch) => {
    return dispatch(submitFeedbackForm(values)).then(({ response, json }) => {
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

const CommentsInput = createTextArea('Comments', 10)
const FeedbackTypeSelect = createSelect('Type')

class FeedbackForm extends Component {

    render() {
        const { error, handleSubmit } = this.props
        return (
            <form onSubmit={handleSubmit}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='type' component={FeedbackTypeSelect}>
                        <option value={null}>---</option>
                        <option value={0}>Bug</option>
                        <option value={1}>Feature Request</option>
                        <option value={2}>Comment</option>
                    </Field>
                </div>
                <div>
                    <Field name='comments' component={CommentsInput} />
                </div>
                <div>
                    <Field name='url' component='input' type='hidden' />
                </div>
            </form>
        )
    }
}

FeedbackForm = reduxForm({
    form: 'feedback',
    validate,
    onSubmit: submit,
    initialValues: {
        url: window.location.href
    }
})(FeedbackForm)

export default FeedbackForm
