import { handleActions } from 'redux-actions'
import actions from '../actions/auth'

const initialState = {
    userId: null,
    userEmail: null,
    authToken: null,
    tokenVerified: false,
    isLoading: false,
    lastUpdated: null
}
const reducer = handleActions({
    [actions.RECEIVE_AUTH_TOKEN]: (state, action) => ({
        ...state, authToken: action.payload
    }),
    [actions.REQUEST_USER_DETAILS]: (state, action) => ({
        ...state, userId: null, userEmail: null, isLoading: true
    }),
    [actions.RECEIVE_USER_DETAILS]: (state, action) => {
        let newState = { ...state, isLoading: false, lastUpdated: action.meta.receivedAt }
        if (!action.error) {
            newState.tokenVerified = true
            newState.userId = action.userId
            newState.userEmail = action.userEmail
        }
        return newState
    },
    [actions.REQUEST_LOGIN]: (state, action) => ({
        ...state, authToken: null, isLoading: true
    }),
    [actions.RECEIVE_LOGIN]: (state, action) => ({
        ...state, authToken: action.payload.auth_token, tokenVerified: !action.error, isLoading: false,
        lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_LOGOUT]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_LOGOUT]: (state, action) => ({
        ...state, authToken: null, isLoading: false, lastUpdated: action.receivedAt
    }),
    [actions.REQUEST_REGISTER]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_REGISTER]: (state, action) => {
        let newState = { ...state, isLoading: false, lastUpdated: action.receivedAt }
        if (!action.error) {
            newState.userId = action.userId
            newState.userEmail = action.userEmail
        }
        return newState
    }
}, initialState)

export default reducer
