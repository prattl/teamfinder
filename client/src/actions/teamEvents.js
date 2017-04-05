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
    CONFIRM_REJECT_APPLICATION: null,
    CANCEL_REJECT_APPLICATION: null,
    REQUEST_UPDATE_APPLICATION_STATUS: null,
    RECEIVE_UPDATE_APPLICATION_STATUS: null,
    CONFIRM_WITHDRAW_INVITATION: null,
    CANCEL_WITHDRAW_INVITATION: null,
    REQUEST_UPDATE_INVITATION_STATUS: null,
    RECEIVE_UPDATE_INVITATION_STATUS: null,
})
export default actions

const TEAM_EVENT_TYPES = {
    INVITATION: 'invitations',
    APPLICATION: 'applications'
}

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
export const tryWithdrawInvitation = createAction(actions.CONFIRM_WITHDRAW_INVITATION)
export const cancelWithdrawInvitation = createAction(actions.CANCEL_WITHDRAW_INVITATION)

const updateTeamEventStatus = eventType => status => (eventId, teamId) => (dispatch, getState) => {
    const actionTypes = eventType === TEAM_EVENT_TYPES.INVITATION ? [
        actions.REQUEST_UPDATE_INVITATION_STATUS, actions.RECEIVE_UPDATE_INVITATION_STATUS
    ] : [
        actions.REQUEST_UPDATE_APPLICATION_STATUS, actions.RECEIVE_UPDATE_APPLICATION_STATUS
    ]
    const [requestActionType, receiveActionType] = actionTypes
    dispatch(createAction(requestActionType)(eventId))
    const { auth: { authToken } } = getState()
    if (authToken) {
        return PATCH(createUrl(`/api/${eventType}/${eventId}/?team=${teamId}`),
            authToken, { status }).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error(json)
                dispatch(createAction(receiveActionType, null, metaGenerator)(payload))
                if (response.ok) {
                    dispatch(requestTeam(teamId, true))
                }
            })
        )
    }
}

const updateApplicationStatus = updateTeamEventStatus(TEAM_EVENT_TYPES.APPLICATION)
const updateInvitationStatus = updateTeamEventStatus(TEAM_EVENT_TYPES.INVITATION)

export const acceptApplication = updateApplicationStatus(2)
export const rejectApplication = updateApplicationStatus(3)
export const withdrawInvitation = updateInvitationStatus(5)

