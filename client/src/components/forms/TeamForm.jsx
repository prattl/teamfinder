import React, { Component, PropTypes } from 'react'
import { Field, reduxForm, SubmissionError } from 'redux-form'
import ReactS3Uploader from 'react-s3-uploader'
import { createUrl } from 'utils'

import { submitCreateTeam, submitEditTeam, submitLogoUpload } from 'actions/teams'

import { Alert, Button } from 'react-bootstrap'
import { createInput, createSelectInput, InterestSelect, LanguageSelect, RegionSelect,
    PositionSelect } from 'components/forms'

const validate = values => {
    const errors = {}
    const fields = ['name', 'regions', 'player_position', 'available_positions']
    const multiSelectFields = ['regions', 'available_positions']
    fields.forEach(fieldName => {
        if ([null, undefined, ''].includes(values[fieldName])) {
            errors[fieldName] = 'Required'
        }
    })
    multiSelectFields.forEach(fieldName => {
        const value = values[fieldName]
        if (value && value.length < 1) {
            errors[fieldName] = 'Required'
        }
    })
    return errors
}

const NameInput = createInput({ label: 'Name' })
const RegionInput = createSelectInput('Regions', RegionSelect)
const PlayerPositionInput = createSelectInput('My Position', PositionSelect, false)
const AvailablePositionInput = createSelectInput('Available Positions', PositionSelect)
const InterestInput = createSelectInput('Team Interests', InterestSelect)
const LanguageInput = createSelectInput('Team Languages', LanguageSelect)

class TeamForm extends Component {

    static propTypes = {
        teamId: PropTypes.string,
        showPlayerPosition: PropTypes.bool
    }

    static defaultProps = {
        teamId: null,
        showPlayerPosition: true
    }

    constructor(props) {
        super(props)
        this.submit = this.submit.bind(this)
        this.getSignedUrl = this.getSignedUrl.bind(this)
        this.handleUploadFinish = this.handleUploadFinish.bind(this)
    }

    submit(values, dispatch) {
        const { teamId } = this.props
        const action = teamId ? submitEditTeam(teamId, values) : submitCreateTeam(values)
        return dispatch(action).then(({ response, json }) => {
            if (!response.ok) {
                const errors = json
                if (json.hasOwnProperty('non_field_errors')) {
                    errors._error = json.non_field_errors[0]
                }
                throw new SubmissionError(errors)
            }
        })
    }

    getSignedUrl(file, callback) {
        const params = {
            objectName: file.name,
            contentType: file.type
        }
        this.props.dispatch(
            submitLogoUpload(params)
        ).then(json => {
            console.log('Got json', json)
            callback(json)
        }).catch(error => {
            console.error(error)
        })
    }

    handleUploadFinish(...args) {
        console.log('Upload finished: args', args)
    }

    render() {
        const { error, handleSubmit, submitting, showPlayerPosition } = this.props
        return (
            <form onSubmit={handleSubmit(this.submit)}>
                {error && <Alert bsStyle='danger'>{error}</Alert>}
                <div>
                    <Field name='name' component={NameInput} />
                </div>
                <div>
                    <Field name='regions' component={RegionInput} />
                </div>
                {showPlayerPosition && (
                    <div>
                        <Field name='player_position' component={PlayerPositionInput} />
                    </div>
                )}
                {/* TODO: Add checkbox for "Currently recruiting?" and conditionally display available positions */}
                <div>
                    <Field name='available_positions' component={AvailablePositionInput} />
                </div>
                <div>
                    <Field name='interests' component={InterestInput} />
                </div>
                <div>
                    <Field name='languages' component={LanguageInput} />
                </div>
                <div>
                    <Button type='submit' disabled={submitting}>
                        Submit
                    </Button>
                </div>

                <div>
                    <ReactS3Uploader getSignedUrl={this.getSignedUrl}
                                     accept='image/*'
                                     uploadRequestHeaders={{}}
                                     onFinish={this.handleUploadFinish}
                                     signingUrlWithCredentials={ true }
                                     contentDisposition='auto'
s
                    />
                </div>
            </form>
        )
    }
}


TeamForm = reduxForm({
    form: 'team',
    validate
})(TeamForm)

export default TeamForm
