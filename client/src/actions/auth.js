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
    RECEIVE_LOGOUT: null
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

export const login = credentials => (dispatch, getState) => {
    localStorage.setItem('authtoken', null)
    dispatch(createAction(actions.REQUEST_LOGIN)())
    return POST(createUrl('/api/auth/login/'), getState().auth.authToken, credentials).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error submitting login.')
            if (response.ok) {
                localStorage.setItem('authtoken', json.auth_token)
                browserHistory.push('/')
                dispatch(requestAuthStatus())
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

export const register = credentials => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_REGISTER)())
    return POST(createUrl('/api/auth/register/'), getState().auth.authToken, credentials).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error submitting register.')
            dispatch(createAction(actions.RECEIVE_REGISTER, p => p, metaGenerator)(payload))
            if (response.ok) {
                dispatch(login(credentials))
            }
            return ({json, response})
        })
    )
}
