import React, { Component } from 'react'

import { Col, Image, Row } from 'react-bootstrap'

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
                    {team && (
                        <Col lg={4} md={3} sm={2}>
                            <div className='text-right'>
                                <Image src={team.logo_url || 'http://via.placeholder.com/300x300'}
                                       thumbnail />
                            </div>
                        </Col>
                    )}
                    <Col lg={4} md={6} sm={8}>
                        {team && <TeamForm initialValues={initialValues}
                                           showPlayerPosition={false} teamId={team.id} />}
                    </Col>
                </Row>

            </div>
        )
    }

}

EditTeam = withTeam(props => props.params.id)(EditTeam)
EditTeam = requireAuthentication(EditTeam)

export default EditTeam
