import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitEditTeamMember } from 'actions/teams'

import { Form, FormControl, FormGroup, Button, Label } from 'react-bootstrap'
import { withPositions } from 'components/connectors/WithFixtures'


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
let PositionSelect = ({ positions, input, meta, children, ...rest }) => (
    <FormGroup bsSize='small'>
        <FormControl componentClass='select'
                     placeholder='Position' {...input} {...rest}>
            <option>---</option>
            {Object.keys(positions.items).map(positionId => (
                <option key={`position-${positionId}-${meta.form}`}
                        value={positionId}>
                    {positions.items[positionId].name}
                </option>
            ))}
        </FormControl>
    </FormGroup>
)
PositionSelect = withPositions(PositionSelect)

class TeamMemberPosition extends Component {

    constructor(props) {
        super(props)
        this.state = {
            changesSaved: false
        }
        this.submit = this.submit.bind(this)
    }

    setChangesSaved(value) {
        this.setState({ changesSaved: value })
        if (value) {
            setTimeout(() => this.setChangesSaved(false), 3000)
        }
    }

    submit(values, dispatch) {
        const { teamMemberId } = this.props
        return dispatch(submitEditTeamMember(teamMemberId, values)).then(({ response, json }) => {
            if (!response.ok) {
                const errors = json
                if (json.hasOwnProperty('non_field_errors')) {
                    errors._error = json.non_field_errors[0]
                }
                throw new SubmissionError(errors)
            } else {
                this.setChangesSaved(true)
            }
        })
    }

    render() {
        const { handleSubmit, submitting } = this.props
        const { changesSaved } = this.state
        return (
            <Form inline onSubmit={handleSubmit(this.submit)}>
                <Field name='position' component={PositionSelect} />&nbsp;
                <Button type='submit'
                        bsStyle='success' bsSize='sm' disabled={submitting}>
                    Save
                </Button>{' '}
                <span className={`text-success ${!changesSaved && 'invisible'}`}>
                    <i className='fa fa-check' />&nbsp;Changes Saved!
                </span>
            </Form>
        )
    }
}

TeamMemberPosition = reduxForm({
    form: 'teamMemberPosition',
    validate
})(TeamMemberPosition)

export default TeamMemberPosition
