import React, { Component, PropTypes } from 'react'
import { ControlLabel, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'
import Select from 'react-select'

import { withAllFixtures } from 'components/connectors/WithFixtures'

export const createGenericInput = (Component, label) => field => (
    <FormGroup controlId={field.input.name}
               validationState={field.meta.touched && field.meta.error ? 'error' : null}>
        {label && <ControlLabel>{label}</ControlLabel>}
        {Component}
        {field.meta.touched && field.meta.error && (
            <HelpBlock>{field.meta.error}</HelpBlock>
        )}
    </FormGroup>
)

export const createInput = (label, type='text') => (field) => (
    <FormGroup controlId={field.input.name}
               validationState={field.meta.touched && field.meta.error ? 'error' : null}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl {...field.input} type={type} placeholder={field.placeholder} />
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
)

export const createSelectInput = (label, SelectComponent, multi) => field => (
    <FormGroup controlId={field.input.name}
               validationState={field.meta.touched && field.meta.error ? 'error' : null}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <SelectComponent {...field} multi={multi} />
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
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
    const { input, multi=true, fixtures: { regions: { items, isLoading, lastUpdated } } } = props
    const options = Object.keys(items).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={multi}
                       matchProp='label'
                       placeholder='Regions'
                       options={options} />
        ) : null
}

RegionSelect = withAllFixtures(RegionSelect)

let SkillBracketSelect = props => {
    const { input, multi=false, fixtures: { skillBrackets: { items, isLoading, lastUpdated } } } = props
    const options = Object.keys(items).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={multi}
                       matchProp='label'
                       placeholder='Skill Bracket'
                       options={options} />
        ): null
}

SkillBracketSelect = withAllFixtures(SkillBracketSelect)

let PositionSelect = props => {
    const { input, multi=true, fixtures: { positions: { items, isLoading, lastUpdated } } } = props
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
                       multi={multi}
                       matchProp='label'
                       placeholder='Positions'
                       options={options} />
        ) : null
}

PositionSelect = withAllFixtures(PositionSelect)

export {
    RegionSelect,
    SkillBracketSelect,
    PositionSelect
}
