import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { fixturesSelector } from 'utils/selectors'

import { Button, Col, Row } from 'react-bootstrap'
import { createInput } from 'components/forms'
import Select from 'react-select'
import { playerSubmit } from 'components/forms/SearchForm'

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
    const { input, fixtures: { regions: { items, isLoading, lastUpdated } } } = props
    const options = Object.keys(items).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={true}
                       matchProp='label'
                       placeholder='Regions'
                       options={options} />
        ) : null
}

RegionSelect = withAllFixtures(RegionSelect)

let SkillBracketSelect = props => {
    const { input, fixtures: { skillBrackets: { items, isLoading, lastUpdated } } } = props
    const options = Object.keys(items).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={false}
                       matchProp='label'
                       placeholder='Skill Bracket'
                       options={options} />
        ): null
}

SkillBracketSelect = withAllFixtures(SkillBracketSelect)

let PositionSelect = props => {
    const { input, fixtures: { positions: { items, isLoading, lastUpdated } } } = props
    const primaryOptions = Object.keys(items).filter(itemId => !items[itemId].secondary).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    const secondaryOptions = Object.keys(items).filter(itemId => items[itemId].secondary).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    const options = [
        ...primaryOptions,
        { value: null, label: '', disabled: true },
        ...secondaryOptions
    ]
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={true}
                       matchProp='label'
                       placeholder='Positions'
                       options={options} />
        ) : null
}

PositionSelect = withAllFixtures(PositionSelect)

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
                        <Field name='skillBracket' component={SkillBracketSelect} />
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
    onSubmit: playerSubmit
})(PlayerSearchForm)

export default PlayerSearchForm
