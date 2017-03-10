import React, { Component } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitCreateTeam } from 'actions/teams'

import { Alert, Button } from 'react-bootstrap'
import { createInput, createSelectInput, RegionSelect, SkillBracketSelect, PositionSelect } from 'components/forms'

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
    const fields = ['name', 'regions', 'skill_bracket', 'player_position', 'available_positions']
    const multiSelectFields = ['regions', 'available_positions']
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

const NameInput = createInput('Name')
const RegionInput = createSelectInput('Regions', RegionSelect)
const SkillBracketInput = createSelectInput('Skill Bracket', SkillBracketSelect)
const PlayerPositionInput = createSelectInput('My Position', PositionSelect, false)
const AvailablePositionInput = createSelectInput('Available Positions', PositionSelect)

class TeamForm extends Component {

    render() {
        const { error, handleSubmit, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='name' component={NameInput} />
                </div>
                <div>
                    <Field name='regions' component={RegionInput} />
                </div>
                <div>
                    <Field name='skill_bracket' component={SkillBracketInput} />
                </div>
                <div>
                    <Field name='player_position' component={PlayerPositionInput} />
                </div>
                {/* TODO: Add checkbox for "Currently recruiting?" and conditionally display available positions */}
                <div>
                    <Field name='available_positions' component={AvailablePositionInput} />
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


TeamForm = reduxForm({
    form: 'team',
    validate,
    onSubmit: submit
})(TeamForm)

export default TeamForm
