import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import RegisterForm from '../../components/forms/RegisterForm'

export default class Register extends Component {

    render() {
        const { isLoading } = this.props
        return (
            <div className='pure-g'>
                <div className='pure-u-md-1-3'></div>
                <div className='pure-u-1 pure-u-md-1-3'>
                    <div className=''>
                        <h1 className='text-center'>Sign In</h1>
                        <RegisterForm isLoading={isLoading}/>
                        <span>Already have an account? <Link to='/log-in'>Log In</Link></span>
                    </div>
                </div>
                <div className='pure-u-md-1-3'></div>
            </div>
        )
    }

}

export default connect(state => state.auth)(Register)