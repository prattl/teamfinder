import React, { Component } from 'react'

import Select from 'react-select'
import selectStyles from 'react-select/dist/react-select.css'

export default class SelectWrapper extends Component {

    handleChange(values) {
        const { onChange } = this.props
        console.log('SelectWrapper', values)
        if (!values) { return onChange([]) }
        if (Array.isArray(values)) {
            //console.log('Calling onChange with', values.map(val => val.value))
            onChange(values.map(val => val.value))
        } else {
            //console.log('Calling onChange with', values.value)
            onChange(values.value)
        }

    }

    render() {
        const {multi, value, onBlur, onChange, ...props} = this.props;
        //console.log('SelectWrapper got props', this.props)
        return (
            (multi ?
                <Select value={value || []} {...props} multi={multi}
                        onBlur={() => onBlur(value)}
                        onChange={(values) => this.handleChange(values)} /> :
                <Select value={value || ''} {...props}
                        onChange={values => this.handleChange(values)} />
            )
        )
    }

}
