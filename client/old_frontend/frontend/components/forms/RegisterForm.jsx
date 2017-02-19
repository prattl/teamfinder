import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import { register } from '../../actions/auth'

const validate = values => {
    const errors = {}
    if (!values.email) {
        errors.email = 'Required'
    }
    if (!values.password) {
        errors.password = 'Required'
    } else if (values.password.length < 3) {
        errors.password = 'Must be at least 8 characters.'
    }
    if (!values.password2) {
        errors.password2 = 'Required'
    } else if (values.password2 != values.password) {
        errors.password = 'Passwords must match.'
    }
    return errors
}

const submit = (values, dispatch) => {
    return dispatch(register(values)).then( ({json, response}) => {
        if (!response.ok) {
            return Promise.reject(json)
        } else {
            Promise.resolve()
        }
    })
}

class RegisterForm extends Component {

    render() {
        const {
            fields: {
                email, password, password2
            },
            error,
            handleSubmit,
            isLoading
        } = this.props

        return (
            <form className='pure-form pure-form-stacked' onSubmit={handleSubmit(submit)}>
                <fieldset>
                    {error &&
                        <div className='pure-g form-row'>
                            <div className='pure-u-1'>
                                <div className='error'>{error}</div>
                            </div>
                        </div>
                    }
                    <div className='pure-g form-row'>
                        <div className='pure-u-1'>
                            <label className={email.touched && email.error && 'has-error'}>
                                Email
                                <input type='email' {...email} />
                            </label>
                            {email.touched && email.error && <div className='error'>{email.error}</div>}
                        </div>
                    </div>
                    <div className='pure-g form-row'>
                        <div className='pure-u-1 pure-u-md-1-2'>
                            <label className={password.touched && password.error && 'has-error'}>
                                Password
                                <input type='password' {...password} />
                            </label>
                            {password.touched && password.error && <div className='error'>{password.error}</div>}
                        </div>
                        <div className='pure-u-1 pure-u-md-1-2'>
                            <label className={password2.touched && password2.error && 'has-error'}>
                                Repeat Password
                                <input type='password' {...password2} />
                            </label>
                            {password2.touched && password2.error && <div className='error'>{password2.error}</div>}
                        </div>
                    </div>

                    <div className='form-row' style={{textAlign: 'center'}}>
                        <button type='submit' disabled={isLoading} className='pure-button pure-button-primary'>
                            {isLoading && <span><i className='fa fa-cog fa-spin' />&nbsp;</span>}Submit
                        </button>
                    </div>
                </fieldset>

            </form>
        )
    }

}

RegisterForm = reduxForm({
    form: 'register',
    fields: ['email', 'password', 'password2'],
    validate
})(RegisterForm)

export default RegisterForm