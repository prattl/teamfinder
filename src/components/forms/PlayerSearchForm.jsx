import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { requestPlayerSearch } from 'actions/playerSearch'

import { fixturesSelector } from 'utils/selectors'

import { Button, Col, FormGroup, FormControl, HelpBlock, Row } from 'react-bootstrap'
import Select from 'react-select'


// TODO: Move this somewhere else
const submit = (values, dispatch) => {
    console.log('submit', values)
    return dispatch(requestPlayerSearch(
        values.keywords, values.region
    )).then(result => console.log('result', result))
}

const renderField = (field) => (
    <FormGroup controlId='keywords'>
        {/*<ControlLabel>Keywords</ControlLabel>*/}
        <FormControl {...field.input} type='text' placeholder={field.placeholder} />
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
)

const withFixtures = (WrappedComponent) => {
    class WithFixtures extends Component {
        // componentDidMount() {
            // TODO
        // }
        render() {
            return <WrappedComponent {...this.props} />
        }
    }
    WithFixtures = connect(fixturesSelector)(WithFixtures)
    return WithFixtures
}

class RegionSelect extends Component {
    handleChange(v) {
        this.props.input.onChange(v ? v.map(r => r.value) : v)
    }

    handleBlur() {
        this.props.input.onBlur(this.props.input.value)
    }

    render() {
        const { input, regions: { items, isLoading, lastUpdated } } = this.props
        const options = Object.keys(items).map(itemId => ({
            value: itemId, label: items[itemId].name
        }))

        return (!isLoading && lastUpdated) ? <Select {...input}
                                                     multi={true}
                                                     placeholder='Regions'
                                                     onBlurResetsInput={false}
                                                     onBlur={() => this.handleBlur()}
                                                     onChange={v => this.handleChange(v)}
                                                     options={options} /> : null
    }
}

RegionSelect = withFixtures(RegionSelect)

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
                        <Field name='region' component={RegionSelect} />
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
        region: []
    },
    onSubmit: submit
})(PlayerSearchForm)

export default PlayerSearchForm
