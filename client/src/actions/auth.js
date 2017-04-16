import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { browserHistory } from 'react-router'
import { createUrl, metaGenerator } from 'utils'
import { GET, POST } from 'utils/api'

const actions = keyMirror({
    REQUEST_AUTH_STATUS: null,
    RECEIVE_AUTH_STATUS: null,
    RECEIVE_AUTH_TOKEN: null,
    REQUEST_LOGIN: null,
    RECEIVE_LOGIN: null,
    REQUEST_LOGOUT: null,
    RECEIVE_LOGOUT: null,
    REQUEST_SIGNUP: null,
    RECEIVE_SIGNUP: null
})
export default actions

const fetchAuthTokenFromStorage = () => (
    createAction(actions.RECEIVE_AUTH_TOKEN)(localStorage.getItem('authtoken'))
)

export const requestAuthStatus = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_AUTH_STATUS)())
    dispatch(fetchAuthTokenFromStorage())
    return GET(createUrl('/api/auth/me/'), getState().auth.authToken).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error retrieving auth status.')
            return dispatch(createAction(actions.RECEIVE_AUTH_STATUS, null, metaGenerator)(payload))
        })
    )
}

export const setAuthTokenFromSteamSignIn = token => (dispatch, getState) => {
    localStorage.setItem('authtoken', token)
    dispatch(createAction(actions.RECEIVE_LOGIN, null, metaGenerator)({ auth_token: token }))
    dispatch(requestAuthStatus())
    browserHistory.push('/profile')
}

export const requestAuthStatusIfNeeded = () => (dispatch, getState) => {
    const { isLoading, lastUpdated } = getState().auth
    if (!isLoading && !lastUpdated) {
        return dispatch(requestAuthStatus())
    }
}

export const login = credentials => (dispatch, getState) => {
    localStorage.setItem('authtoken', null)
    dispatch(createAction(actions.REQUEST_LOGIN)())
    return POST(createUrl('/api/auth/login/'), getState().auth.authToken, credentials).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error submitting login.')
            if (response.ok) {
                localStorage.setItem('authtoken', json.auth_token)
                dispatch(requestAuthStatus())
                browserHistory.push('/profile')
            }
            dispatch(createAction(actions.RECEIVE_LOGIN, null, metaGenerator)(payload))
            return ({ response, json })
        })
    )
}

export const logout = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_LOGOUT)())
    return POST(createUrl('/api/auth/logout/'), getState().auth.authToken).then(
        response => {
            const payload = response.ok ? null : new Error('Error submitting logout.')
            if (response.ok) {
                localStorage.setItem('authtoken', null)
            }
            return dispatch(createAction(actions.RECEIVE_LOGOUT, null, metaGenerator)(payload))
        }
    )
}

export const signUp = credentials => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_SIGNUP)())
    return POST(createUrl('/api/auth/register/'), null, credentials).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error submitting register.')
            dispatch(createAction(actions.RECEIVE_SIGNUP, null, metaGenerator)(payload))
            if (response.ok) {
                dispatch(login(credentials))
            }
            return ({ response, json })
        })
    )
}
