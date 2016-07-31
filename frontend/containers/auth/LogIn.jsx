import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import LoginForm from '../../components/forms/LoginForm'

export default class LogIn extends Component {

    render() {
        const { isLoading } = this.props
        return (
            <div className='pure-g'>
                <div className='pure-u-md-1-3'></div>
                <div className='pure-u-1 pure-u-md-1-3'>
                    <div className=''>
                        <h1 className='text-center'>Sign In</h1>
                        <LoginForm isLoading={isLoading}/>
                        <span>Don't have an account yet? <Link to='/register'>Create an account</Link></span>
                    </div>
                </div>
                <div className='pure-u-md-1-3'></div>
            </div>
        )
    }

}

export default connect(state => state.auth)(LogIn)