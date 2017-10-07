import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Field, change, touch } from 'redux-form'
import { Checkbox, ControlLabel, FormGroup, FormControl, HelpBlock } from 'react-bootstrap'
import Select from 'react-select'
import ReactS3Uploader from 'react-s3-uploader'

import { withAllFixtures, withPositions } from 'components/connectors/WithFixtures'
import { submitLogoUpload } from 'actions/teams'

export const createGenericInput = (Component, label) => field => (
    <FormGroup controlId={field.input.name}
               validationState={field.meta.touched && field.meta.error ? 'error' : null}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <Component {...field.input} />
        {field.meta.touched && field.meta.error && (
            <HelpBlock>{field.meta.error}</HelpBlock>
        )}
    </FormGroup>
)

export const createInput = ({ label='', type='text', disabled=false, helpText=null } = {}) => (field) => (
    <FormGroup controlId={field.input.name}
               validationState={field.meta.touched && field.meta.error ? 'error' : null}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl {...field.input} type={type} placeholder={field.placeholder} disabled={disabled}/>
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
        {helpText && <HelpBlock>{helpText}</HelpBlock>}
    </FormGroup>
)
export const createTextArea = ({ label, maxLength, rows = 5 }) => (field) => (
    <FormGroup controlId={field.input.name}
               validationState={field.meta.touched && field.meta.error ? 'error' : null}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl {...field.input} componentClass='textarea' rows={rows} placeholder={field.placeholder} />
        {maxLength && <div className='text-right'>{field.input.value.length}/{maxLength}</div>}
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </FormGroup>
)
export const createSelect = (label) => (field) => (
    <FormGroup controlId={field.input.name}
               validationState={field.meta.touched && field.meta.error ? 'error' : null}>
        {label && <ControlLabel>{label}</ControlLabel>}
        <FormControl {...field.input} componentClass='select' placeholder={field.placeholder}>
            {field.children}
        </FormControl>
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

export const createCheckboxInput = (label) => (field) => (
    <Checkbox validationState={field.meta.touched && field.meta.error ? 'error' : null} {...field}>
        {label}
        {field.meta.touched && field.meta.error &&
        <HelpBlock>{field.meta.error}</HelpBlock>}
    </Checkbox>
)

let SinglePositionSelect = ({ positions, input, meta, children, ...rest }) => (
    <FormGroup controlId={input.name}
               validationState={meta.touched && meta.error ? 'error' : null}>
        <ControlLabel>Position</ControlLabel>
        <FormControl componentClass='select'
                     placeholder='Position' {...input} {...rest}>
            <option>---</option>
            {Object.keys(positions.items).map(positionId => (
                <option key={`position-${positionId}-${meta.form}`}
                        value={positionId}>
                    {positions.items[positionId].name}
                </option>
            ))}
        </FormControl>
        {meta.touched && meta.error && (
            <HelpBlock>{meta.error}</HelpBlock>
        )}
    </FormGroup>
)
SinglePositionSelect = withPositions(SinglePositionSelect)

export const INVALID_LOGO_DIMENSIONS = 'invalid_logo_dimensions'
export const createS3UploadInput = props => {
    const LogoUrlInput = createInput({ type: 'hidden' })

    class _S3Upload extends Component {

        constructor(props) {
            super(props)
            this.formatFilename = this.formatFilename.bind(this)
            this.getSignedUrl = this.getSignedUrl.bind(this)
            this.handleClick = this.handleClick.bind(this)
            this.handleUploadStart = this.handleUploadStart.bind(this)
            this.handleUploadFinish = this.handleUploadFinish.bind(this)
        }

        formatFilename(filename) {
            return `${this.props.teamId}-${filename}`
        }

        getSignedUrl(file, callback) {
            const params = {
                objectName: this.formatFilename(file.name),
                contentType: file.type
            }
            this.props.dispatch(
                submitLogoUpload(params)
            ).then(json => {
                callback(json)
            }).catch(error => {
                console.error(error)
            })
        }

        handleClick() {
            this.props.dispatch(touch('team', ['logo_url']))
        }

        handleUploadStart(file, next) {
            let url = URL.createObjectURL(file)
            const img = new Image()
            img.onload = () => {
                const invalidDimensions = img.height > 300 || img.width > 300
                if (invalidDimensions) {
                    this.props.dispatch(
                        change('team', 'logo_url', INVALID_LOGO_DIMENSIONS)
                    )
                } else {
                    next(file)
                }
            }
            img.src = url
        }

        handleUploadFinish(obj, file) {
            const filename = this.formatFilename(file.name)
            this.props.dispatch(
                change('team', 'logo_url', `https://dotateamfinder.s3.amazonaws.com/team-logos/${filename}`)
            )
        }

        render() {
            const { meta } = this.props
            const uploaderProps = {
                getSignedUrl: this.getSignedUrl,
                accept: 'image/*',
                uploadRequestHeaders: {},
                preprocess: this.handleUploadStart,
                onFinish: this.handleUploadFinish,
                signingUrlWithCredentials: true,
                scrubFilename: this.formatFilename,
                contentDisposition: 'auto',
            }

            return (
                <FormGroup validationState={meta.touched && meta.error ? 'error' : null}>
                    <ControlLabel>Team Logo</ControlLabel>
                        <ReactS3Uploader {...uploaderProps}
                                         onClick={this.handleClick}
                                         className='form-control' />
                    <HelpBlock>File must be no larger than 300x300 pixels.</HelpBlock>
                    <Field name='logo_url' component={LogoUrlInput} />
                </FormGroup>
            )

        }
    }

    return connect(null)(_S3Upload)
}

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
        return <div className='form-group'><Select {...input}
                       onBlurResetsInput={false}
                       onBlur={this.handleBlur}
                       onChange={v => this.handleChange(v)}
                       {...otherProps} /></div>
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

let InterestSelect = props => {
    const { input, multi=true, fixtures: { interests: { items, isLoading, lastUpdated } } } = props
    const options = Object.keys(items).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={multi}
                       matchProp='label'
                       placeholder='Interests'
                       options={options} />
        ) : null
}

InterestSelect = withAllFixtures(InterestSelect)

let LanguageSelect = props => {
    const { input, multi=true, fixtures: { languages: { items, isLoading, lastUpdated } } } = props
    const options = Object.keys(items).map(itemId => ({
        value: itemId, label: items[itemId].name
    }))
    return (!isLoading && lastUpdated) ? (
        <SelectWrapper input={input}
                       multi={multi}
                       matchProp='label'
                       placeholder='Languages'
                       options={options} />
        ) : null
}

LanguageSelect = withAllFixtures(LanguageSelect)

export {
    InterestSelect,
    LanguageSelect,
    RegionSelect,
    PositionSelect,
    SinglePositionSelect,
}
