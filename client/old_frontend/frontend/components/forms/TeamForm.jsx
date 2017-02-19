import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import Select from '../Select'
import { submitCreateTeam, submitUpdateTeam } from '../../actions/memberships'
import { browserHistory } from 'react-router'
import selectStyles from 'react-select/dist/react-select.css'

const requiredFields = ['name', 'skill_bracket', 'regions', 'player_role']

const validate = values => {
    const errors = {}
    requiredFields.forEach(fieldName => {
        if (!values.hasOwnProperty(fieldName) || !values[fieldName] || (values[fieldName] && values[fieldName].length == 0)) {
            errors[fieldName] = 'Required'
        }
    })

    console.log('validate() got values', values)
    if (values.name && values.name.length > 255) {
        errors.name = 'Must be 255 characters or less.'
    }

    console.log('validate returning errors', errors)

    return errors
}

const submit = (values, dispatch) => {
    console.log('submit got values', values)
    const actionCreator = values.teamId ? submitUpdateTeam : submitCreateTeam
    return dispatch(actionCreator(values)).then( ({json, response}) => {
        if (!response.ok) {
            if (json.hasOwnProperty('non_field_errors')) {
                json._error = json.non_field_errors
            }
            return Promise.reject(json)
        } else {
            browserHistory.push('/my-teams')
            Promise.resolve()
        }
    })
}

class TeamForm extends Component {

    render() {
        const {
            fields: {
                name, regions, available_roles, skill_bracket, player_role, teamId
            },
            error,
            handleSubmit,
            submitting
        } = this.props

        const { bracketOptions, regionOptions, roleOptions } = this.props.profile
        const { changesSaved } = this.props.memberships

        const regionSelectOptions = regionOptions.map(region => ({
            label: region.region_name, value: region.id
        }))

        const roleSelectOptions = roleOptions.map(role => ({
            label: role.role_name, value: role.id
        }))

        return (

            <form className='pure-form pure-form-stacked' onSubmit={handleSubmit(submit)}>
                <fieldset>
                    {changesSaved &&
                        <div className='pure-g form-row'>
                            <div className='pure-u-1'>
                                <div className='success'>Your changes have been saved.</div>
                            </div>
                        </div>
                    }
                    {error &&
                        <div className='pure-g form-row'>
                            <div className='pure-u-1'>
                                <div className='error'>{error}</div>
                            </div>
                        </div>
                    }

                    <div className='pure-g form-row'>
                        <div className='pure-u-1'>
                            <label className={name.touched && name.error && 'has-error'}>
                                Team Name
                                <input type='text' {...name} />
                            </label>
                            {name.touched && name.error && <div className='error'>{name.error}</div>}
                        </div>
                    </div>
                    <div className='pure-g form-row'>
                        <div className='pure-u-1'>
                            <label className={skill_bracket.touched && skill_bracket.error && 'has-error'}>
                                Skill Bracket (MMR Range)
                                <select {...skill_bracket} value={skill_bracket.value || ''}>
                                    <option></option>
                                    {bracketOptions.map(({bracket_name, id}) => (
                                        <option key={id} value={id}>{bracket_name}</option>
                                    ))}
                                </select>
                            </label>
                            {skill_bracket.touched && skill_bracket.error && <div className='error'>{skill_bracket.error}</div>}
                        </div>
                    </div>
                    <div className='pure-g form-row'>
                        <div className='pure-u-1'>
                            <label className={regions.touched && regions.error && 'has-error'}>Regions</label>
                            <Select options={regionSelectOptions} multi={true} {...regions} />
                            {regions.touched && regions.error && <div className='error'>{regions.error}</div>}
                        </div>
                    </div>
                    <div className='pure-g form-row'>
                        <div className='pure-u-1'>
                            <label className={player_role.touched && player_role.error && 'has-error'}>My Role</label>
                            <Select options={roleSelectOptions} value={player_role.value} {...player_role}  />
                            {player_role.touched && player_role.error && <div className='error'>{player_role.error}</div>}
                        </div>
                    </div>
                    <div className='pure-g form-row'>
                        <div className='pure-u-1'>
                            <label className={available_roles.touched && available_roles.error && 'has-error'}>Available Roles</label>
                            <Select options={roleSelectOptions} multi={true} {...available_roles} />
                            {available_roles.touched && available_roles.error && <div className='error'>{available_roles.error}</div>}
                        </div>
                    </div>

                    <div className='form-row' style={{textAlign: 'center'}}>
                        <button type='submit' disabled={submitting} className='pure-button pure-button-primary'>
                            {submitting && <span><i className='fa fa-cog fa-spin' />&nbsp;</span>}Save
                        </button>
                    </div>
                    <input type='hidden' {...teamId} />
                </fieldset>

            </form>
        )
    }

}

TeamForm = reduxForm({
    form: 'createTeam',
    fields: ['name', 'skill_bracket', 'regions', 'player_role', 'available_roles', 'teamId'],
    validate
})(TeamForm)

export default TeamForm