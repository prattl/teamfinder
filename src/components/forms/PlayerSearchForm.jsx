import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'

class PlayerSearchForm extends Component {

    render() {
        const { handleSubmit } = this.props
        return (
            <form onSubmit={handleSubmit}>

            </form>
        )
    }

}

PlayerSearchForm = reduxForm({
    form: 'playerSearch'
})(PlayerSearchForm)

export default PlayerSearchForm
