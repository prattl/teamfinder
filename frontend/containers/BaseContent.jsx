import React, { Component } from 'react'
import { render } from 'react-dom'

import Footer from '../components/Footer'

export default class BaseContent extends Component {
    render() {
        return (
            <div className='container-fluid'>
                {React.cloneElement(this.props.children)}
                <Footer />
            </div>
        )
    }
}
