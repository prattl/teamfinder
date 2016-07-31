import fetch from 'isomorphic-fetch'
import { getCookie } from '../utils/index'
import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import api from '../api/api'
import { requestMemberships } from './memberships'

const actions = keyMirror({
    REQUEST_PLAYER_INFO: null,
    RECEIVE_PLAYER_INFO: null,
    REQUEST_SUBMIT_PLAYER_INFO: null,
    RECEIVE_SUBMIT_PLAYER_INFO: null,
    REQUEST_BRACKET_OPTIONS: null,
    RECEIVE_BRACKET_OPTIONS: null,
    REQUEST_REGION_OPTIONS: null,
    RECEIVE_REGION_OPTIONS: null,
    REQUEST_ROLE_OPTIONS: null,
    RECEIVE_ROLE_OPTIONS: null
})
export default actions

const metaGenerator = meta => ({receivedAt: Date.now()})

export function fetchBracketOptions() {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_BRACKET_OPTIONS)())
        return api.get2('/api/skill_brackets/').then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error retrieving bracket options.')
                return dispatch(createAction(actions.RECEIVE_BRACKET_OPTIONS,
                    payload => payload, metaGenerator)(payload))
            }
        )
    }
}

export function fetchRegionOptions() {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_REGION_OPTIONS)())
        return api.get2('/api/regions/').then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error retrieving region options.')
                return dispatch(createAction(actions.RECEIVE_REGION_OPTIONS,
                    payload => payload, metaGenerator)(payload))
            }
        )
    }
}

export function fetchRoleOptions() {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_ROLE_OPTIONS)())
        return api.get2('/api/roles/').then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error retrieving role options.')
                return dispatch(createAction(actions.RECEIVE_ROLE_OPTIONS,
                    payload => payload, metaGenerator)(payload))
            }
        )
    }
}

export function fetchPlayerInfo() {
    return (dispatch, getState) => {
        const { authToken, tokenVerified } = getState().auth
        if (Boolean(authToken && tokenVerified)) {
            dispatch(createAction(actions.REQUEST_PLAYER_INFO)())
            dispatch(fetchProfileFormOptions())
            return api.get2('/api/players/me/', getState().auth.authToken).then(
                ({json, response}) => {
                    const payload = response.ok ? json : new Error('Error retrieving player info.')
                    dispatch(requestMemberships(payload.id))
                    return dispatch(createAction(actions.RECEIVE_PLAYER_INFO,
                        payload => payload, metaGenerator)(payload))
                }
            )
        }
    }
}

export function fetchProfileFormOptions() {
    return (dispatch, getState) => {
        dispatch(fetchBracketOptions())
        dispatch(fetchRegionOptions())
        return dispatch(fetchRoleOptions())
    }
}

export function submitPlayerInfo(values) {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_SUBMIT_PLAYER_INFO)())
        return api.patch(`/api/players/${getState().profile.player.id}/`, getState().auth.authToken, values).then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error(json.detail)
                dispatch(createAction(actions.RECEIVE_SUBMIT_PLAYER_INFO,
                    p => p, metaGenerator)(payload))
                return ({json, response})
            }
        )
    }
}
