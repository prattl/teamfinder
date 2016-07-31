import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router-redux'

import TeamForm from '../components/forms/TeamForm'

export default class EditTeam extends Component {

    render() {
        const { memberships } = this.props.memberships
        const { id } = this.props.params
        const membership = Object.keys(memberships).map(k => memberships[k]).find(m => m.team.id == id)

        let initialValues = {}
        if (membership) {
            const { team } = membership
            initialValues.teamId = team.id
            initialValues.name = team.name
            initialValues.skill_bracket = team.skill_bracket.id
            initialValues.regions = team.regions.map(region => region.id)
            initialValues.player_role = membership.position.id
            initialValues.available_roles = team.available_roles.map(role => role.id)
        }
        const initialData = {initialValues}
        console.log('initialData', initialData)
        return (
            <div className='pure-g'>
                <div className='pure-u-md-1-3'></div>
                <div className='pure-u-1 pure-u-md-1-3'>
                    <h1>Edit Team</h1>
                    <TeamForm {...this.props} {...initialData} />
                </div>
            </div>
        )
    }

}

export default connect(state => ({profile: state.profile, memberships: state.memberships}))(EditTeam)