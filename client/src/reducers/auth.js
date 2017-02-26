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
        ...state, isLoading: false
    })
}, initialState)

export default auth
