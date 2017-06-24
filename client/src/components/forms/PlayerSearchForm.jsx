import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button, Col, Row } from 'react-bootstrap'
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
                <Row>
                    <Col sm={4}>
                        <Field name='keywords' component={KeywordsInput} placeholder='Keywords' />
                    </Col>
                    <Col sm={4}>
                        <Field name='regions' component={RegionSelect} />
                    </Col>
                    <Col sm={4}>
                        <Field name='positions' component={PositionSelect} />
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Field name='interests' component={InterestSelect} />
                    </Col>
                    <Col sm={2}>
                        <Field name='min_mmr' component={MMRInput} placeholder='Min. MMR' />
                    </Col>
                    <Col sm={2}>
                        <Field name='max_mmr' component={MMRInput} placeholder='Max. MMR' />
                    </Col>
                    <Col sm={4}>
                        <div className='checkbox'>
                            <label>
                                <Field name='include_estimated_mmr' component='input' type='checkbox'/>
                                &nbsp;Include Estimated MMR&nbsp;<EstimatedMMRHelpIcon />
                            </label>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Field name='languages' component={LanguageSelect} />
                    </Col>
                    <Col sm={4}>
                        <Button type='submit' disabled={submitting}>
                            <i className='fa fa-search'/>&nbsp;Submit
                        </Button>
                    </Col>
                </Row>
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
