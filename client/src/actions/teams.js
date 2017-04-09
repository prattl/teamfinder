import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { browserHistory } from 'react-router'
import { requestOwnPlayer } from 'actions/player'
import { createUrl, metaGenerator } from 'utils'
import { GET, PATCH, POST, DELETE } from 'utils/api'
import { notify } from 'utils/actions'

const actions = keyMirror({
    REQUEST_TEAM: null,
    RECEIVE_TEAM: null,
    REQUEST_SUBMIT_CREATE_TEAM: null,
    RECEIVE_SUBMIT_CREATE_TEAM: null,
    REQUEST_SUBMIT_EDIT_TEAM: null,
    RECEIVE_SUBMIT_EDIT_TEAM: null,
    CONFIRM_DELETE_TEAM: null,
    CANCEL_DELETE_TEAM: null,
    CONFIRM_DELETE_TEAM_MEMBER: null,
    CANCEL_DELETE_TEAM_MEMBER: null,
    REQUEST_DELETE_TEAM: null,
    RECEIVE_DELETE_TEAM: null,
    REQUEST_DELETE_TEAM_MEMBER: null,
    RECEIVE_DELETE_TEAM_MEMBER: null,
    CONFIRM_PROMOTE_TO_CAPTAIN: null,
    CANCEL_PROMOTE_TO_CAPTAIN: null,
    REQUEST_PROMOTE_TO_CAPTAIN: null,
    RECEIVE_PROMOTE_TO_CAPTAIN: null,
    REQUEST_EDIT_TEAM_MEMBER: null,
    RECEIVE_EDIT_TEAM_MEMBER: null
})
export default actions

// async : need for api requests
export const requestTeam = (id, refresh=false) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM)(id))
    if (!refresh) {
        const {teams} = getState().teams
        if (Object.keys(teams).includes(id)) {
            const team = teams[id]
            if (team.team) {
                return dispatch(createAction(actions.RECEIVE_TEAM, null, metaGenerator)(team))
            }
        }
    }
    const url = createUrl(`/api/teams/${id}/`)
    // then : how you finish a promise (start and finish later (async))
    return GET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving team.')
        return dispatch(createAction(actions.RECEIVE_TEAM, null, metaGenerator)(payload))
    }))
}

export const submitCreateTeam = data => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_SUBMIT_CREATE_TEAM)())
    const { auth: { authToken } } = getState()
    if (authToken) {
        return POST(createUrl('/api/teams/'), authToken, data).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error('Error creating team.')
                dispatch(createAction(actions.RECEIVE_SUBMIT_CREATE_TEAM, null, metaGenerator)(payload))
                if (response.ok) {
                    browserHistory.push(`/teams/manage/${json.id}`)
                }
                return ({ response, json })
            })
        )
    }
}

export const submitEditTeam = (teamId, data) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_SUBMIT_EDIT_TEAM)())
    const { auth: { authToken } } = getState()
    if (authToken) {
        return PATCH(createUrl(`/api/teams/${teamId}/`), authToken, data).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error('Error creating team.')
                dispatch(createAction(actions.RECEIVE_SUBMIT_EDIT_TEAM, null, metaGenerator)(payload))
                notify(response)
                return ({ response, json })
            })
        )
    }
}

export const tryDeleteTeam = createAction(actions.CONFIRM_DELETE_TEAM)
export const cancelDeleteTeam = createAction(actions.CANCEL_DELETE_TEAM)
export const tryDeleteTeamMember = createAction(actions.CONFIRM_DELETE_TEAM_MEMBER)
export const cancelDeleteTeamMember = createAction(actions.CANCEL_DELETE_TEAM_MEMBER)

export const tryPromoteToCaptain = createAction(actions.CONFIRM_PROMOTE_TO_CAPTAIN)
export const cancelPromoteToCaptain = createAction(actions.CANCEL_PROMOTE_TO_CAPTAIN)

export const deleteTeam = teamId => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_DELETE_TEAM)(teamId))
    const { auth: { authToken } } = getState()
    if (authToken) {
        return DELETE(createUrl(`/api/teams/${teamId}/`), authToken).then(
            response => {
                const payload = response.ok ? teamId : new Error('Error deleting team.')
                if (response.ok) {
                    browserHistory.push('/teams/manage/')
                }
                dispatch(requestOwnPlayer())
                return dispatch(createAction(actions.RECEIVE_DELETE_TEAM, null, metaGenerator)(payload))
            }
        )
    }
}

export const deleteTeamMember = (teamMemberId, teamId, leavingTeam=false) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_DELETE_TEAM_MEMBER)(teamMemberId))
    const { auth: { authToken } } = getState()
    if (authToken) {
        return DELETE(createUrl(`/api/memberships/${teamMemberId}/`), authToken).then(response => {
            return response[response.status === 204 ? 'text' : 'json']().then(json => {
                const payload = response.ok ? teamMemberId : new Error(json.error)
                    if (leavingTeam && response.ok) {
                        browserHistory.push('/teams/manage/')
                    }
                    return dispatch(createAction(actions.RECEIVE_DELETE_TEAM_MEMBER, null, p => ({
                    ...metaGenerator(p),
                    teamMemberId, teamId  // TODO: Putting this information in meta isn't ideal
                }))(payload))
            })
        })
    }
}

export const promoteToCaptain = (teamMemberId, teamId) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_PROMOTE_TO_CAPTAIN)({ teamMemberId, teamId }))
    const { auth: { authToken } } = getState()
    if (authToken) {
        const { player } = getState().teams.teams[teamId].team.team_members.find(teamMember => teamMember.id === teamMemberId)
        return PATCH(createUrl(`/api/teams/${teamId}/`), authToken, { captain: player.id }).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error(json.detail)
                return dispatch(createAction(actions.RECEIVE_PROMOTE_TO_CAPTAIN, null, p => ({
                    ...metaGenerator(p),
                    teamMemberId, teamId
                }))(payload))
            })
        )
    }
}

export const submitEditTeamMember = (teamMemberId, data) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_EDIT_TEAM_MEMBER)())
    const { auth: { authToken } } = getState()
    if (authToken) {
        return PATCH(createUrl(`/api/memberships/${teamMemberId}/`), authToken, data).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error(json)
                dispatch(createAction(actions.RECEIVE_EDIT_TEAM_MEMBER, null, p => ({
                    ...metaGenerator(p),
                    teamMemberId
                }))(payload))
                notify(response)
                return ({ response, json })
            })
        )
    }
}
