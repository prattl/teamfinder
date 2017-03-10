import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { requestTeam } from 'actions/teams'

import { Link } from 'react-router'
import { Label } from 'react-bootstrap'
import { Col, Row } from 'react-bootstrap'
import { withAllFixtures } from 'components/connectors/WithFixtures'
import { withTeam, withTeamFromParams } from 'components/connectors/WithTeam'
import { requestPlayer } from 'actions/playerSearch'
import { playerSearchSelector } from 'utils/selectors'
import { FixtureDisplay, Loading } from 'utils'
import { CaptainIcon, RegionIcon, PlayersIcon, PositionIcon, SkillBracketIcon } from 'utils/components/icons'

class ManageTeam extends Component {

    static propTypes = {
        team: PropTypes.object.isRequired
    }

    render() {
        const { team: { team, isLoading, lastUpdated } } = this.props

        return (
            <div>
                {isLoading ? <Loading /> : (
                    lastUpdated ? (
                        <div>
                            <h1>Manage Team: {team.name}</h1>
                        </div>
                    ) : (
                        <div>Error retrieving team.</div>
                    )
                )}
            </div>
        )
    }
}

ManageTeam = withTeam(props => props.params.id)(ManageTeam)

export default ManageTeam
