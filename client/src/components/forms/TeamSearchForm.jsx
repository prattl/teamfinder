import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { fixturesSelector } from 'utils/selectors'

import { Button, Col, Row } from 'react-bootstrap'
import { createInput } from 'components/forms'
import { teamSubmit } from 'components/forms/SearchForm'
import Select from 'react-select'
import { withFixtures } from 'utils/components/fixtures'

export const withAllFixtures = withFixtures(
    createStructuredSelector({
        fixtures: fixturesSelector,
    }),
)

class SelectWrapper extends Component {

    static propTypes = {
        input: PropTypes.object.isRequired,
        multi: PropTypes.bool,
        placeholder: PropTypes.string
    }

    static defaultProps = {
        multi: false,
        placeholder: ''
    }

    constructor(props) {
        super(props)
        this.handleBlur = this.handleBlur.bind(this)
    }

    handleChange(v) {
        const { input, multi } = this.props
        input.onChange(multi ? v.map(r => r.value) : v ? v.value : '')
    }

    handleBlur() {
        const { input } = this.props
        input.onBlur(input.value)
    }

    render() {
        const { input, ...otherProps } = this.props
        return <Select {...input}
                       onBlurResetsInput={false}
                       onBlur={this.handleBlur}
                       onChange={v => this.handleChange(v)}
                       {...otherProps} />
    }

}

let RegionSelect = props => {
    const {input, fixtures: {regions: {items, isLoading, lastUpdated}}} = props
    const options = Object.keys(items).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={true}
                       matchProp='label'
                       placeholder='Regions'
                       options={options}/>
    ) : null
}

RegionSelect = withAllFixtures(RegionSelect)

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