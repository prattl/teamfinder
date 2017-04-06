import React, { Component } from 'react'
// import { connect } from 'react-redux'

import { Alert, Col, Image, Row } from 'react-bootstrap'

import { withTeam } from 'components/connectors/WithTeam'
import TeamForm from 'components/forms/TeamForm'
import requireAuthentication from 'components/auth/AuthenticationRequired'

class EditTeam extends Component {

    // constructor(props) {
    //     super(props)
        // this.handleChangesSavedDismiss = this.handleChangesSavedDismiss.bind(this)
    // }

    // handleChangesSavedDismiss() {
    //     this.props.onDismissChangesSaved()
    // }

    // componentDidMount() {
    //     this.props.onLoad()
    // }

    render() {
        const { team: teamInstance, team: { team, isLoading, lastUpdated }, player } = this.props
        const initialValues = team ? ({
            name: team.name,
            skill_bracket: team.skill_bracket,
            available_positions: team.available_positions,
            regions: team.regions
        }) : {}
        return (
            // TODO: Make sure only captain can view the form

            <div>
                <h1>Edit Team</h1>
                <Row>
                    <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
                        {/*{changesSaved && (*/}
                            {/*<Alert bsStyle='success' onDismiss={this.handleChangesSavedDismiss}>Changes saved!</Alert>*/}
                        {/*)}*/}
                        {team && <TeamForm initialValues={initialValues} showPlayerPosition={false} />}
                    </Col>
                </Row>

            </div>
        )
    }

}

EditTeam = withTeam(props => props.params.id)(EditTeam)
// EditTeam = connect(
//     null,
//     { onLoad: requestOwnPlayerIfNeeded, onDismissChangesSaved: dismissChangesSaved }
// )(EditTeam)

EditTeam = requireAuthentication(EditTeam)

export default EditTeam
