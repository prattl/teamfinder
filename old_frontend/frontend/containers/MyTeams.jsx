import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Modal from 'react-modal'

import { requestMemberships, submitDeleteTeam } from '../actions/memberships'

import styles from './../styles/my-teams.scss'

export default class Teams extends Component {

    constructor(props) {
        super(props)
        this.state = {deleteModalOpen: false, deletingTeam: null}
    }

    //componentDidMount() {
    //    this.props.dispatch(requestMemberships())
    //}

    handleDeleteTeamClick(e, team) {
        e.preventDefault()
        this.setState({deleteModalOpen: true, deletingTeam: team})
    }

    handleDeleteTeamConfirm() {
        this.props.dispatch(submitDeleteTeam(this.state.deletingTeam.id))
        this.handleModalClose()
    }

    handleModalClose() {
        this.setState({deleteModalOpen: false, deletingTeam: null})
    }

    getModalStyles() {
        return {
            content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)'
            }
        }
    }

    render() {
        console.log('MyTeams render()', this.props)
        const { profile, memberships } = this.props
        const teams = Object.keys(memberships.memberships).map(k => memberships.memberships[k].team)
        console.log('memberships', memberships.memberships)
        console.log('teams', teams)
        const { deleteModalOpen, deletingTeam } = this.state

        return (
            <div className='pure-g'>
                <div className='pure-u-md-5-6'>
                    <h1>My Teams</h1>
                    {!teams &&
                        <div>Loading...</div>
                    }
                    <ul className='my-teams-list'>
                        {teams && teams.length > 0 &&
                            teams.map(team => (
                                <li key={team.id}>
                                    <div className='left'>
                                        <h2>{team.name}</h2>
                                        {team.available_roles.length > 0 &&
                                            <span className='label label-success recruiting'>
                                                <i className='fa fa-check'></i>&nbsp;Recruiting
                                            </span>
                                        }
                                    </div>
                                    <div className='right toolbar'>
                                        <Link to={`teams/${team.id}/edit`} className='edit'>
                                            <i className='fa fa-pencil'></i>
                                        </Link>
                                        <a href='' className='delete'
                                           onClick={e => this.handleDeleteTeamClick(e, team)}>
                                            <i className='fa fa-trash'></i>
                                        </a>
                                    </div>
                                    <div className='clearfix'></div>

                                    <ul className='inline players'>
                                        {team.team_members.map(teamMember => (
                                            <li key={`team-${team.id}-member-${teamMember.id}`}>
                                                {teamMember.player.username}{team.captain.id == teamMember.player.id && <span>&nbsp;<i className='fa fa-star fa-xs'></i></span>}
                                            </li>
                                        ))}
                                    </ul>

                                    <ul className='inline regions'>
                                        {team.regions.map(region => (
                                            <li key={region.id}>
                                                {region.region_name}
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))
                        }
                        <li className='create-team'>
                            <Link to='/teams/create'><i className='fa fa-plus'></i>&nbsp;Create a Team</Link>
                        </li>
                    </ul>
                </div>
                <Modal isOpen={deleteModalOpen}
                       onRequestClose={() => this.handleModalClose()}
                       style={this.getModalStyles()}>
                    <h3>Are you sure you want to delete team {deletingTeam ? deletingTeam.name : ''}?</h3>
                    <p>This cannot be undone.</p>
                    <button className='pure-button' onClick={() => this.handleDeleteTeamConfirm()}>Delete</button>
                </Modal>
            </div>
        )
    }

}

export default connect(state => ({profile: state.profile, memberships: state.memberships}))(Teams)
