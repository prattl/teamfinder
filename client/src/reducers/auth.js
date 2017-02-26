import { handleActions } from 'redux-actions'
import actions from 'actions/auth'

const initialState = {
    userId: null,
    userEmail: null,
    authToken: null,
    tokenVerified: false,
    isLoading: false,
    lastUpdated: null
}

const auth = handleActions({
    [actions.REQUEST_AUTH_STATUS]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_AUTH_STATUS]: (state, action) => ({
        ...state,
        tokenVerified: !action.error,
        userId: action.error ? null : action.payload.id,
        userEmail: action.error ? null : action.payload.email,
        isLoading: false, lastUpdated: action.meta.receivedAt
    }),
    [actions.RECEIVE_AUTH_TOKEN]: (state, action) => ({
        ...state, authToken: action.payload
    }),
    [actions.REQUEST_LOGIN]: (state, action) => ({
        ...state, authToken: null, isLoading: true
    }),
    [actions.RECEIVE_LOGIN]: (state, action) => ({
        ...state, authToken: action.payload.auth_token, tokenVerified: !action.error,
        isLoading: false, lastUpdated: action.meta.receivedAt
    })
}, initialState)

export default auth
