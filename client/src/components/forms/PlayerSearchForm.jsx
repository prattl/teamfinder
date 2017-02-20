import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { createStructuredSelector } from 'reselect'

import { requestAllFixturesIfNeeded } from 'actions/fixtures'
import { requestPlayerSearch } from 'actions/playerSearch'
import { fixturesSelector } from 'utils/selectors'

import { Button, Col, FormGroup, FormControl, HelpBlock, Row } from 'react-bootstrap'
import Select from 'react-select'


// TODO: Move this somewhere else
const submit = (values, dispatch) => {
    console.log('submit', values)
    return dispatch(requestPlayerSearch(values)).then(result => console.log('result', result))
}

const renderField = (field) => (
    <FormGroup controlId={field.input.name}>
        {/*<ControlLabel>Keywords</ControlLabel>*/}
        <FormControl {...field.input} type='text' placeholder={field.placeholder} />
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
)

const withFixtures = (selector) => (WrappedComponent) => {
    class WithFixtures extends Component {

        componentDidMount() {
            this.props.onLoad()
        }

        render() {
            return <WrappedComponent {...this.props} />
        }

    }
    WithFixtures = connect(selector, { onLoad: requestAllFixturesIfNeeded })(WithFixtures)
    return WithFixtures
}

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
        console.log('blur', this.props)
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


class PlayerSearchForm extends Component {

    render() {
        const { handleSubmit, submitting } = this.props
        return (
            <form onSubmit={handleSubmit}>
                <Row>
                    <Col sm={4}>
                        <Field name='keywords' component={renderField} placeholder='Keywords' />
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
    onSubmit: submit
})(PlayerSearchForm)

export default PlayerSearchForm
