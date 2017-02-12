import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { requestPlayerSearch } from 'actions/playerSearch'

import { Button, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'


// TODO: Move this somewhere else
// TODO: This is resulting in an `undefined` action being dispatched
const submit = (values, dispatch) => {
    console.log('submit got', values)
    return dispatch(requestPlayerSearch(values.keywords)).then(result => console.log('result', result))
}

const renderField = (field) => (
    <FormGroup controlId='keywords'>
        <ControlLabel>Keywords</ControlLabel>
        <FormControl {...field.input} type='text' />
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
  )

class PlayerSearchForm extends Component {

    render() {
        const { handleSubmit, pristine, reset, submitting } = this.props
        return (
            <form onSubmit={handleSubmit(submit)}>
                <Field name='keywords' component={renderField} />
                <Button type='submit' disabled={submitting}>Submit</Button>
            </form>
        )
    }

}

PlayerSearchForm = reduxForm({
    form: 'playerSearch'
})(PlayerSearchForm)

export default PlayerSearchForm
