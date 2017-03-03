import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { requestAllFixturesIfNeeded } from 'actions/fixtures'
import { requestPlayerSearch } from 'actions/playerSearch'
import { fixturesSelector } from 'utils/selectors'

import { Button, Col, Row } from 'react-bootstrap'
import { createInput, RegionSelect, PositionSelect, SkillBracketSelect } from 'components/forms'


// TODO: Move this somewhere else
const submit = (values, dispatch) => {
    return dispatch(requestPlayerSearch(values))
}

const KeywordsInput = createInput()

class PlayerSearchForm extends Component {

    render() {
        const { handleSubmit, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col sm={4}>
                        <Field name='keywords' component={KeywordsInput} placeholder='Keywords' />
                    </Col>
                    <Col sm={2}>
                        <Button type='submit' disabled={submitting}>
                            <i className='fa fa-search'/>&nbsp;Submit</Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Field name='regions' component={RegionSelect} />
                    </Col>
                    <Col sm={4}>
                        <Field name='positions' component={PositionSelect} />
                    </Col>
                    <Col sm={4}>
                        <Field name='skill_bracket' component={SkillBracketSelect} />
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
        regions: [],
        positions: [],
        skillBracket: ''
    },
    onSubmit: submit
})(PlayerSearchForm)

export default PlayerSearchForm
