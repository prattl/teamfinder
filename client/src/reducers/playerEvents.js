import { handleActions } from 'redux-actions'
import actions from 'actions/playerEvents'
import authActions from 'actions/auth'

import { arrayToObject } from 'utils'

const initialEventsState = {
    items: {},
    isLoading: false,
    lastUpdated: null,
}

const initialState = {
    applications: {
        ...initialEventsState,
        confirmWithdraw: null
    },
    invitations: {
        ...initialEventsState,
        confirmAccept: null,
        confirmReject: null
    },
}

const teamEvents = handleActions({
    [actions.REQUEST_PLAYER_INVITATIONS]: (state, action) => ({
        ...state, invitations: {
            ...state.invitations, isLoading: true
        }
    }),
    [actions.RECEIVE_PLAYER_INVITATIONS]: (state, action) => ({
        ...state, invitations: {
            ...state.invitations,
            items: {
                ...state.invitations.items,
                ...arrayToObject(action.payload.results)
            },
            isLoading: false, lastUpdated: action.meta.receivedAt
        }
    }),
    [actions.REQUEST_PLAYER_APPLICATIONS]: (state, action) => ({
        ...state, applications: {
            ...state.applications, isLoading: true
        }
    }),
    [actions.RECEIVE_PLAYER_APPLICATIONS]: (state, action) => ({
        ...state, applications: {
            ...state.applications,
            items: {
                ...state.applications.items,
                ...arrayToObject(action.payload.results)
            },
            isLoading: false, lastUpdated: action.meta.receivedAt
        }
    }),
    [actions.CONFIRM_ACCEPT_INVITATION]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            confirmAccept: action.payload
        }
    }),
    [actions.CANCEL_ACCEPT_INVITATION]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            confirmAccept: null
        }
    }),
    [actions.CONFIRM_REJECT_INVITATION]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            confirmReject: action.payload
        }
    }),
    [actions.CANCEL_REJECT_INVITATION]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            confirmReject: null
        }
    }),
    [actions.CONFIRM_WITHDRAW_APPLICATION]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            confirmWithdraw: action.payload
        }
    }),
    [actions.CANCEL_WITHDRAW_APPLICATION]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            confirmWithdraw: null
        }
    }),
    [actions.RECEIVE_UPDATE_PLAYER_APPLICATION_STATUS]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            items: {
                ...state.applications.items,
                [action.payload.id]: action.payload,
            },
            confirmWithdraw: null
        }
    }),
    [actions.RECEIVE_UPDATE_PLAYER_INVITATION_STATUS]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            items: {
                ...state.invitations.items,
                [action.payload.id]: action.payload,
            },
            confirmAccept: null, confirmReject: null
        }
    }),
    [authActions.RECEIVE_LOGOUT]: (state, action) => ({
        ...initialState
    })
}, initialState)

export default teamEvents
