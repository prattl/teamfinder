import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Button, Col, Row } from 'react-bootstrap'
import { teamSubmit } from 'components/forms/SearchForm'
import { createInput, RegionSelect, PositionSelect, SkillBracketSelect } from 'components/forms'

const KeywordsInput = createInput()

class TeamSearchForm extends Component {

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

TeamSearchForm = reduxForm({
    form: 'teamSearch',
    initialValues: {
        keywords: '',
        regions: [],
    },
    onSubmit: teamSubmit
})(TeamSearchForm)

export default TeamSearchForm
