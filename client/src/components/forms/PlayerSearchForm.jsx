import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button } from 'react-bootstrap'
import { playerSubmit } from 'components/forms/SearchForm'
import { createInput, InterestSelect, LanguageSelect, RegionSelect, PositionSelect } from 'components/forms'
import { EstimatedMMRHelpIcon } from 'utils'

const KeywordsInput = createInput()
const MMRInput = createInput({ type: 'number' })

class PlayerSearchForm extends Component {

    render() {
        const { handleSubmit, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                <Field name='keywords' component={KeywordsInput} placeholder='Keywords' />
                <Field name='regions' component={RegionSelect} />
                <Field name='positions' component={PositionSelect} />
                <Field name='interests' component={InterestSelect} />
                <Field name='languages' component={LanguageSelect} />
                <Field name='min_mmr' component={MMRInput} placeholder='Min. MMR' />
                <Field name='max_mmr' component={MMRInput} placeholder='Max. MMR' />
                <div className='checkbox'>
                    <label>
                        <Field name='include_estimated_mmr' component='input' type='checkbox'/>
                        &nbsp;Include Estimated MMR&nbsp;<EstimatedMMRHelpIcon />
                    </label>
                </div>
                <Button type='submit' disabled={submitting}>
                    <i className='fa fa-search'/>&nbsp;Submit
                </Button>
            </form>
        )
    }

}

PlayerSearchForm = reduxForm({
    form: 'playerSearch',
    initialValues: {
        keywords: '',
        interests: [],
        languages: [],
        regions: [],
        positions: [],
        min_mmr: null,
        max_mmr: null,
        include_estimated_mmr: true,
    },
    onSubmit: playerSubmit
})(PlayerSearchForm)

export default PlayerSearchForm
