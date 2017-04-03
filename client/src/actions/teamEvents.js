import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { GET, PATCH } from 'utils/api'

const actions = keyMirror({
    REQUEST_TEAM_INVITATIONS: null,
    RECEIVE_TEAM_INVITATIONS: null,
    REQUEST_TEAM_APPLICATIONS: null,
    RECEIVE_TEAM_APPLICATIONS: null,
    CONFIRM_ACCEPT_APPLICATION: null,
    CANCEL_ACCEPT_APPLICATION: null,
    REQUEST_ACCEPT_APPLICATION: null,
    RECEIVE_ACCEPT_APPLICATION: null,
})
export default actions

export const requestTeamInvitations = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM_INVITATIONS)(id))
    const url = createUrl(`/api/invitations/?team=${id}`)
    return GET(url, getState().auth.authToken).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving team invitations.')
        return dispatch(createAction(actions.RECEIVE_TEAM_INVITATIONS, null, metaGenerator)(payload))
    }))
}

export const requestTeamApplications = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM_APPLICATIONS)(id))
    const url = createUrl(`/api/applications/?team=${id}`)
    return GET(url, getState().auth.authToken).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving team applications.')
        return dispatch(createAction(actions.RECEIVE_TEAM_APPLICATIONS, null, metaGenerator)(payload))
    }))
}

export const tryAcceptApplication = createAction(actions.CONFIRM_ACCEPT_APPLICATION)
export const cancelAcceptApplication = createAction(actions.CANCEL_ACCEPT_APPLICATION)

export const acceptApplication = (applicationId, teamId) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_ACCEPT_APPLICATION)(applicationId))
    const { auth: { authToken } } = getState()
    if (authToken) {
        // const { player } = getState().teams.teams[teamId].team.team_members.find(teamMember => teamMember.id === teamMemberId)
        return PATCH(createUrl(`/api/applications/${applicationId}/`), authToken, { status: 2 }).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error(json.detail)
                return dispatch(createAction(actions.RECEIVE_ACCEPT_APPLICATION, null, metaGenerator)(payload))
            })
        )
    }
}
