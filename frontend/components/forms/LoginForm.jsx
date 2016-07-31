import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import { login } from 'actions/auth'

const validate = values => {
    const errors = {}
    if (!values.email) {
        errors.email = 'Required'
    }
    if (!values.password) {
        errors.password = 'Required'
    }
    return errors
}

const submit = (values, dispatch) => {
    return dispatch(login(values)).then( ({json, response}) => {
        if (!response.ok) {
            if (json.hasOwnProperty('non_field_errors')) {
                json._error = json.non_field_errors
            }
            return Promise.reject(json)
        } else {
            Promise.resolve()
        }
    })
}

class LoginForm extends Component {

    render() {
        const {
            fields: {
                email, password
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
                        <div className='pure-u-1'>
                            <label className={password.touched && password.error && 'has-error'}>
                                Password
                                <input type='password' {...password} />
                            </label>
                            {password.touched && password.error && <div className='error'>{password.error}</div>}
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

LoginForm = reduxForm({
    form: 'login',
    fields: ['email', 'password'],
    validate
})(LoginForm)

export default LoginForm
