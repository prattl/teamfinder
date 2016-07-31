import { handleActions } from 'redux-actions'
import actions from '../actions/memberships'
import { actionTypes as reduxFormActions } from 'redux-form'

const initialState = {
    memberships: {},
    changesSaved: false,
    isLoading: false,
    lastUpdated: null
}

const reducer = handleActions({
    [actions.REQUEST_MEMBERSHIPS]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_MEMBERSHIPS]: (state, action) => ({
        ...state, memberships: action.payload, isLoading: false, lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_CREATE_TEAM]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_CREATE_TEAM]: (state, action) => ({
        ...state, changesSaved: !action.error, isLoading: false,
        lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_UPDATE_TEAM]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_UPDATE_TEAM]: (state, action) => ({
        ...state, changesSaved: !action.error, isLoading: false,
        lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_DELETE_TEAM]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_DELETE_TEAM]: (state, action) => ({
        ...state, isLoading: false, lastUpdated: action.meta.receivedAt
    }),
    [reduxFormActions.INITIALIZE]: (state, action) => ({
        ...state, changesSaved: false
    })
}, initialState)

export default reducer
