import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitCreateTeam } from 'actions/teams'

import { Form, FormControl, FormGroup, Button } from 'react-bootstrap'
// import { createSelectInput, PositionSelect } from 'components/forms'

const submit = (values, dispatch) => {
    return dispatch(submitCreateTeam(values)).then(({ response, json }) => {
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
    // const fields = ['name', 'regions', 'skill_bracket', 'player_position', 'available_positions']
    // const multiSelectFields = ['regions', 'available_positions']
    // fields.forEach(fieldName => {
    //     if ([null, undefined, ''].includes(values[fieldName])) {
    //         errors[fieldName] = 'Required'
    //     }
    // })
    // multiSelectFields.forEach(fieldName => {
    //     const value = values[fieldName]
    //     if (value && value.length < 1) {
    //         errors[fieldName] = 'Required'
    //     }
    // })
    return errors
}

// const PositionInput = createSelectInput(null, PositionSelect, false)
const PositionSelect = ({ input, children, ...rest }) => (
    <FormGroup bsSize='small'>
        <FormControl componentClass='select'
                     placeholder='Position' {...input} {...rest}>
            {children}
        </FormControl>
    </FormGroup>
)

class TeamMemberPosition extends Component {

    render() {
        const { handleSubmit } = this.props
        return (
            <Form inline onSubmit={handleSubmit}>
                <Field name='position' component={PositionSelect}>
                    <option>---</option>
                </Field>&nbsp;
                <Button bsStyle='success' bsSize='sm'>Save</Button>
            </Form>
        )
    }
}


TeamMemberPosition = reduxForm({
    form: 'teamMemberPosition',
    validate,
    onSubmit: submit
})(TeamMemberPosition)

export default TeamMemberPosition
