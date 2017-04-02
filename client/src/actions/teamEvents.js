import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { GET, PATCH, POST, DELETE } from 'utils/api'

const actions = keyMirror({
    REQUEST_TEAM_INVITATIONS: null,
    RECEIVE_TEAM_INVITATIONS: null,
    REQUEST_TEAM_APPLICATIONS: null,
    RECEIVE_TEAM_APPLICATIONS: null
})
export default actions

export const requestTeamInvitations = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM_INVITATIONS)(id))
    const url = createUrl(`/api/invitations/?team=${id}/`)
    return GET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving team invitations.')
        return dispatch(createAction(actions.RECEIVE_TEAM_INVITATIONS, null, metaGenerator)(
            { result: payload, id }
        ))
    }))
}

export const requestTeamApplications = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM_INVITATIONS)(id))
    const url = createUrl(`/api/applications/?team=${id}/`)
    return GET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving team applications.')
        return dispatch(createAction(actions.RECEIVE_TEAM_APPLICATIONS, null, metaGenerator)(
            { result: payload, id }
        ))
    }))
}
