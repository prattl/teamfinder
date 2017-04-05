import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { requestTeam } from 'actions/teams'
import { GET, PATCH } from 'utils/api'

const actions = keyMirror({
    REQUEST_TEAM_INVITATIONS: null,
    RECEIVE_TEAM_INVITATIONS: null,
    REQUEST_TEAM_APPLICATIONS: null,
    RECEIVE_TEAM_APPLICATIONS: null,
    CONFIRM_ACCEPT_APPLICATION: null,
    CANCEL_ACCEPT_APPLICATION: null,
    // REQUEST_ACCEPT_APPLICATION: null,
    // RECEIVE_ACCEPT_APPLICATION: null,
    CONFIRM_REJECT_APPLICATION: null,
    CANCEL_REJECT_APPLICATION: null,
    // REQUEST_REJECT_APPLICATION: null,
    // RECEIVE_REJECT_APPLICATION: null,

    REQUEST_UPDATE_APPLICATION_STATUS: null,
    RECEIVE_UPDATE_APPLICATION_STATUS: null
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
export const tryRejectApplication = createAction(actions.CONFIRM_REJECT_APPLICATION)
export const cancelRejectApplication = createAction(actions.CANCEL_REJECT_APPLICATION)

const updateApplicationStatus = status => (applicationId, teamId) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_UPDATE_APPLICATION_STATUS)(applicationId))
    const { auth: { authToken } } = getState()
    if (authToken) {
        return PATCH(createUrl(`/api/applications/${applicationId}/?team=${teamId}`), authToken, { status }).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error(json)
                dispatch(createAction(actions.RECEIVE_UPDATE_APPLICATION_STATUS, null, metaGenerator)(payload))
                if (response.ok) {
                    dispatch(requestTeam(teamId, true))
                }
            })
        )
    }
}

export const acceptApplication = updateApplicationStatus(2)
export const rejectApplication = updateApplicationStatus(3)
