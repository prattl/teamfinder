import React, { Component, PropTypes } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'

import { submitCreateTeam, submitEditTeam } from 'actions/teams'

import { Alert, Button } from 'react-bootstrap'
import { createInput, createSelectInput, RegionSelect, SkillBracketSelect, PositionSelect } from 'components/forms'

const validate = values => {
    const errors = {}
    const fields = ['name', 'regions', 'skill_bracket', 'player_position', 'available_positions']
    const multiSelectFields = ['regions', 'available_positions']
    fields.forEach(fieldName => {
        if ([null, undefined, ''].includes(values[fieldName])) {
            errors[fieldName] = 'Required'
        }
    })
    multiSelectFields.forEach(fieldName => {
        const value = values[fieldName]
        if (value && value.length < 1) {
            errors[fieldName] = 'Required'
        }
    })
    return errors
}

const NameInput = createInput({ label: 'Name' })
const RegionInput = createSelectInput('Regions', RegionSelect)
const SkillBracketInput = createSelectInput('Skill Bracket', SkillBracketSelect)
const PlayerPositionInput = createSelectInput('My Position', PositionSelect, false)
const AvailablePositionInput = createSelectInput('Available Positions', PositionSelect)

class TeamForm extends Component {

    static propTypes = {
        teamId: PropTypes.string,
        showPlayerPosition: PropTypes.bool
    }

    static defaultProps = {
        teamId: null,
        showPlayerPosition: true
    }

    constructor(props) {
        super(props)
        this.submit = this.submit.bind(this)
    }

    submit(values, dispatch) {
        const { teamId } = this.props
        const action = teamId ? submitEditTeam(teamId, values) : submitCreateTeam(values)
        return dispatch(action).then(({ response, json }) => {
            if (!response.ok) {
                const errors = json
                if (json.hasOwnProperty('non_field_errors')) {
                    errors._error = json.non_field_errors[0]
                }
                throw new SubmissionError(errors)
            }
        })
    }

    render() {
        const { error, handleSubmit, submitting, showPlayerPosition } = this.props
        return (
            <form onSubmit={handleSubmit(this.submit)}>
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
                {showPlayerPosition && (
                    <div>
                        <Field name='player_position' component={PlayerPositionInput} />
                    </div>
                )}
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
    validate
})(TeamForm)

export default TeamForm
