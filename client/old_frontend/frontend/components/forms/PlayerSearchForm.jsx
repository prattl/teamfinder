import React, { Component } from 'react'
import { reduxForm } from 'redux-form'

import { requestPlayers } from 'actions/players'

const validate = values => {
    const errors = {}

    return errors
}

const submit = (values, dispatch) => {
    console.log('playerSubmit got', values, dispatch)
    return dispatch(requestPlayers(values)).then( ({json, response}) => {
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

class PlayerSearchForm extends Component {

    render() {
        const {
            fields: {
                query
            },
            error,
            handleSubmit,
            isLoading
        } = this.props

        return (
            <form className='pure-form player-search-form'
                  onSubmit={handleSubmit(submit)}>
                <fieldset>
                    {error && <div className='error'>{error}</div>}
                    <input type='search' placeholder='Search' {...query} />
                    <button type='submit' disabled={isLoading} className='pure-button pure-button-primary'>
                        <i className={`fa ${isLoading ? 'fa-cog fa-spin' : 'fa-search'}`} />
                    </button>
                    {query.touched && query.error && <div className='error'>{query.error}</div>}
                </fieldset>

            </form>
        )
    }

}

PlayerSearchForm = reduxForm({
    form: 'playerSearch',
    fields: ['query'],
    validate
})(PlayerSearchForm)

export default PlayerSearchForm
