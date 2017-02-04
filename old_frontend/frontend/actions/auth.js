import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { browserHistory } from 'react-router'

import { fetchPlayerInfo } from './profile'
import api from 'api/api'
import { metaGenerator } from './utils'

const actions = keyMirror({
    RETRIEVE_AUTH_TOKEN: null,
    RECEIVE_AUTH_TOKEN: null,
    REQUEST_USER_DETAILS: null,
    RECEIVE_USER_DETAILS: null,
    REQUEST_LOGIN: null,
    RECEIVE_LOGIN: null,
    REQUEST_LOGOUT: null,
    RECEIVE_LOGOUT: null,
    REQUEST_REGISTER: null,
    RECEIVE_REGISTER: null
})
export default actions

function fetchAuthTokenFromStorage() {
    return (dispatch, getState) => {
        dispatch(createAction(actions.RETRIEVE_AUTH_TOKEN)())
        const authToken = localStorage.getItem('authtoken')
        if (authToken != 'null') {
            return dispatch(createAction(actions.RECEIVE_AUTH_TOKEN)(authToken))
        }
    }
}

function fetchUserDetails() {
    return (dispatch, getState) => {
        const { authToken } = getState().auth
        if (authToken) {
            dispatch(createAction(actions.REQUEST_USER_DETAILS)())
            return api.get2('/api/auth/me/', authToken).then(
                ({json, response}) => {
                    const payload = response.ok ? json : new Error('Error retrieving user details.')
                    return dispatch(createAction(actions.RECEIVE_USER_DETAILS, p => p, metaGenerator)(payload))
                }
            ).then((action) => {
                if (!action.error) {
                    dispatch(fetchPlayerInfo())
                }
                return action
            })
        }
    }
}

function shouldFetch(getState) {
    return !getState().auth.isLoading
}

export function fetchUserDetailsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldFetch(getState)) {
            dispatch(fetchAuthTokenFromStorage())
            return dispatch(fetchUserDetails())
        }
    }
}

export function login(credentials) {
    return (dispatch, getState) => {
        localStorage.setItem('authtoken', null)
        dispatch(createAction(actions.REQUEST_LOGIN)())
        return api.post2('/api/auth/login/', getState().auth.authToken, credentials).then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error submitting login.')
                dispatch(createAction(actions.RECEIVE_LOGIN, p => p, metaGenerator)(payload))
                if (response.ok) {
                    localStorage.setItem('authtoken', json.auth_token)
                    browserHistory.push('/')
                    dispatch(fetchPlayerInfo())
                }
                return ({json, response})
            }
        )
    }
}

export function logout() {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_LOGOUT)())
        return api.post2('/api/auth/logout/', getState().auth.authToken).then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error submitting logout.')
                if (response.ok) {
                    localStorage.setItem('authtoken', null)
                    browserHistory.push('/')
                }
                return dispatch(createAction(actions.RECEIVE_LOGOUT, p => p, metaGenerator)(payload))
            }
        )
    }
}

export function register(credentials) {
    return (dispatch, getState) => {
        dispatch(createAction(actions.REQUEST_REGISTER)())
        return api.post2('/api/auth/register/', getState().auth.authToken, credentials).then(
            ({json, response}) => {
                const payload = response.ok ? json : new Error('Error submitting register.')
                dispatch(createAction(actions.RECEIVE_REGISTER, p => p, metaGenerator)(payload))
                if (response.ok) {
                    dispatch(login(credentials))
                }
                return ({json, response})
            }
        )
    }
}
