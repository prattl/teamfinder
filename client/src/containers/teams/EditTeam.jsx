import React, { Component } from 'react'

import { Col, Row } from 'react-bootstrap'

import { withTeam } from 'components/connectors/WithTeam'
import TeamForm from 'components/forms/TeamForm'
import requireAuthentication from 'components/auth/AuthenticationRequired'

class EditTeam extends Component {

    render() {
        const { team: { team } } = this.props
        const initialValues = team ? ({
            name: team.name,
            available_positions: team.available_positions,
            interests: team.interests,
            languages: team.languages,
            regions: team.regions
        }) : {}
        return (
            // TODO: Make sure only captain can view the form
            <div>
                <h1>Edit Team</h1>
                <Row>
                    <Col lg={4} lgOffset={4} md={6} mdOffset={3} sm={8} smOffset={2}>
                        {team && <TeamForm initialValues={initialValues} showPlayerPosition={false} teamId={team.id} />}
                    </Col>
                </Row>

            </div>
        )
    }

}

EditTeam = withTeam(props => props.params.id)(EditTeam)
EditTeam = requireAuthentication(EditTeam)

export default EditTeam
