import { handleActions } from 'redux-actions'
import actions from 'actions/teamEvents'
import { arrayToObject } from 'utils'

const initialEventsState = {
    items: {},
    isLoading: false,
    lastUpdated: null,
}

const initialState = {
    applications: {
        ...initialEventsState,
        confirmAccept: null,
        confirmReject: null
    },
    invitations: {
        ...initialEventsState,
        confirmWithdraw: null
    },
}

const playerEvents = handleActions({
    [actions.REQUEST_TEAM_INVITATIONS]: (state, action) => ({
        ...state, invitations: {
            ...state.invitations, isLoading: true
        }
    }),
    [actions.RECEIVE_TEAM_INVITATIONS]: (state, action) => ({
        ...state, invitations: {
            ...state.invitations,
            items: {
                ...state.invitations.items,
                ...arrayToObject(action.payload.results)
            },
            isLoading: false, lastUpdated: action.meta.receivedAt
        }
    }),
    [actions.REQUEST_TEAM_APPLICATIONS]: (state, action) => ({
        ...state, applications: {
            ...state.applications, isLoading: true
        }
    }),
    [actions.RECEIVE_TEAM_APPLICATIONS]: (state, action) => ({
        ...state, applications: {
            ...state.applications,
            items: {
                ...state.applications.items,
                ...arrayToObject(action.payload.results)
            },
            isLoading: false, lastUpdated: action.meta.receivedAt
        }
    }),
    [actions.CONFIRM_ACCEPT_APPLICATION]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            confirmAccept: action.payload
        }
    }),
    [actions.CANCEL_ACCEPT_APPLICATION]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            confirmAccept: null
        }
    }),
    [actions.CONFIRM_REJECT_APPLICATION]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            confirmReject: action.payload
        }
    }),
    [actions.CANCEL_REJECT_APPLICATION]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            confirmReject: null
        }
    }),
    [actions.CONFIRM_WITHDRAW_INVITATION]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            confirmWithdraw: action.payload
        }
    }),
    [actions.CANCEL_WITHDRAW_INVITATION]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            confirmWithdraw: null
        }
    }),
    [actions.RECEIVE_UPDATE_TEAM_APPLICATION_STATUS]: (state, action) => ({
        ...state,
        applications: {
            ...state.applications,
            items: {
                ...state.applications.items,
                [action.payload.id]: action.payload,
            },
            confirmAccept: null, confirmReject: null
        }
    }),
    [actions.RECEIVE_UPDATE_TEAM_INVITATION_STATUS]: (state, action) => ({
        ...state,
        invitations: {
            ...state.invitations,
            items: {
                ...state.invitations.items,
                [action.payload.id]: action.payload,
            },
            confirmWithdraw: null
        }
    })
}, initialState)

export default playerEvents
