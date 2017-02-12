import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { requestPlayerSearch } from 'actions/playerSearch'

import { Button, Form, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'


// TODO: Move this somewhere else
const submit = (values, dispatch) => {
    console.log('submit got', values)
    return dispatch(requestPlayerSearch(values.keywords)).then(result => console.log('result', result))
}

const renderField = (field) => (
    <FormGroup controlId='keywords'>
        {/*<ControlLabel>Keywords</ControlLabel>*/}
        <FormControl {...field.input} type='text' placeholder={field.placeholder} />
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
  )

class PlayerSearchForm extends Component {

    render() {
        const { handleSubmit, submitting } = this.props
        return (
            <Form inline onSubmit={handleSubmit}>
                <Field name='keywords' component={renderField} placeholder='Keywords' />
                &nbsp;
                <Button type='submit' disabled={submitting}>
                    <i className='fa fa-search'/>&nbsp;Submit</Button>
            </Form>
        )
    }

}

PlayerSearchForm = reduxForm({
    form: 'playerSearch',
    onSubmit: submit
})(PlayerSearchForm)

export default PlayerSearchForm
