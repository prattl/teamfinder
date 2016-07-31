import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import Select from 'components/Select'
//import Select from 'react-select'
import { fetchPlayerInfo, fetchProfileFormOptions, submitPlayerInfo } from 'actions/profile'

const fieldNames = ['username', 'skill_bracket', 'regions', 'roles']
const requiredFields = ['username', 'skill_bracket']

const validate = values => {
    const errors = {}
    console.log('validate() got values', values)
    if (!values.username) {
        errors.username = 'Required'
    }
    if (values.username && values.username.length > 255) {
        errors.username = 'Must be 255 characters or less.'
    }

    return errors
}

const submit = (values, dispatch) => {
    return new Promise((resolve, reject) => {
        return dispatch(submitPlayerInfo(values)).then(
            ({json, response}) => {
                const errorFields = ['non_field_errors', 'detail']
                if (!response.ok) {
                    errorFields.forEach(error => {
                        if (json.hasOwnProperty(error)) {
                            json._error = json[error]
                        }
                    })
                    reject(json)
                } else {
                    resolve(json)
                }
            }
        )
    })
}



class ProfileForm extends Component {

    constructor(props) {
        super(props)
        //this.handleRegionsChange = this.handleRegionsChange.bind(this)
    }

    componentDidMount() {
        // Load initial form data
        console.log('ProfileForm mount', this.props)
        //const { load } = this.props
        //console.log('Calling load')
        //load(this.props.player)
        //console.log('load done')
        //this.props.dispatch(fetchPlayerInfo())
    }

    handleRegionsChange(val) {
        console.log('handleRegionsChange', val)
        this.props.fields.regions.onChange(val)
    }

    render() {
        const {
            fields: {
                username, skill_bracket, regions, roles
            },
            bracketOptions,
            changesSaved,
            regionOptions,
            roleOptions,
            error,
            handleSubmit,
            submitting
        } = this.props

        console.log('ProfileForm', this.props)

        const regionSelectOptions = regionOptions.map(region => ({
            label: region.region_name, value: region.id
        }))

        const roleSelectOptions = roleOptions.filter(role => !role.secondary).map(role => ({
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
                            <label className={username.touched && username.error && 'has-error'}>
                                Username
                                <input type='text' {...username} />
                            </label>
                            {username.touched && username.error && <div className='error'>{username.error}</div>}
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
                            <label>Regions</label>
                            <Select options={regionSelectOptions}
                                    multi={true} {...regions} onChange={val => this.handleRegionsChange(val)}  />
                            {regions.touched && regions.error && <div className='error'>{regions.error}</div>}
                        </div>
                    </div>
                    <div className='pure-g form-row'>
                        <div className='pure-u-1'>
                            <label>Roles</label>
                            <Select options={roleSelectOptions}  multi={true} {...roles}
                                     />
                            {roles.touched && roles.error && <div className='error'>{roles.error}</div>}
                        </div>
                    </div>

                    <div className='form-row' style={{textAlign: 'center'}}>
                        <button type='submit' disabled={submitting}
                                className='pure-button pure-button-primary'>
                            {submitting && <span><i className='fa fa-cog fa-spin' />&nbsp;</span>}Save
                        </button>
                    </div>
                </fieldset>

            </form>
        )
    }

}

ProfileForm = reduxForm({
    form: 'profile',
    fields: fieldNames,
    validate
}, state => {
    const { player } = state.profile
    return {
        initialValues: {
            username: player.username,
            skill_bracket: player.skill_bracket ? player.skill_bracket.id : '',
            regions: player.regions ? player.regions.map(r => r.id) : [],
            roles: player.roles ? player.roles.map(r => r.id) : []
        }
    }

}
)(ProfileForm)

export default ProfileForm
