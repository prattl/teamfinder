import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import api from '../api/api'

const actions = keyMirror({
    REQUEST_MEMBERSHIPS: null,
    RECEIVE_MEMBERSHIPS: null,
    REQUEST_CREATE_TEAM: null,
    RECEIVE_CREATE_TEAM: null,
    REQUEST_DELETE_TEAM: null,
    RECEIVE_DELETE_TEAM: null,
    REQUEST_UPDATE_TEAM: null,
    RECEIVE_UPDATE_TEAM: null
})
export default actions

const metaGenerator = meta => ({receivedAt: Date.now()})

export function requestMemberships(id) {
    return (dispatch, getState) => {
        const playerId = id //getState().profile.player.id
        dispatch(createAction(actions.REQUEST_MEMBERSHIPS)())
        return api.get2(`/api/players/${playerId}/memberships/`, getState().auth.authToken).then(
            ({json, response}) => {
                let data = {}
                json.map(elem => data[elem.id] = elem)
                const payload = response.ok ? data : new Error('Error retrieving memberships.')
                dispatch(createAction(actions.RECEIVE_MEMBERSHIPS, p => p, metaGenerator)(payload))
                return ({json, response})
            }
        )
    }
}

export function submitCreateTeam(data) {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_CREATE_TEAM)())
        return api.post2('/api/teams/', getState().auth.authToken, data).then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error creating team.')
                dispatch(createAction(actions.RECEIVE_CREATE_TEAM,
                    payload => payload, metaGenerator)(payload))
                dispatch(requestMemberships(getState().profile.player.id))
                return ({json, response})
            }
        )
    }
}

export function submitUpdateTeam(data) {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_UPDATE_TEAM)())
        return api.patch(`/api/teams/${data.teamId}/`, getState().auth.authToken, data).then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error updating team.')
                dispatch(createAction(actions.REQUEST_UPDATE_TEAM,
                    payload => payload, metaGenerator)(payload))
                dispatch(requestMemberships(getState().profile.player.id))
                return ({json, response})
            }
        )
    }
}

export const submitDeleteTeam = (id) => (
    (dispatch, getState) =>  {
        dispatch(createAction(actions.REQUEST_DELETE_TEAM)())
        return api.del(`/api/teams/${id}/`, getState().auth.authToken).then(
            () => {
                return dispatch(createAction(actions.RECEIVE_DELETE_TEAM,
                    payload => payload, metaGenerator)(id))
            }
        )
    }
)