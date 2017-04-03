import { handleActions } from 'redux-actions'
import actions from 'actions/teamEvents'
import { arrayToObject } from 'utils'

const initialEventsState = {
    items: {},
    confirmAccept: null,
    confirmReject: null,
    isLoading: false,
    lastUpdated: null,
}

const initialState = {
    applications: initialEventsState,
    invitations: initialEventsState,
    confirmApplication: null,
}

const teamEvents = handleActions({
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
        ...state, confirmAccept: action.payload
    }),
    [actions.CANCEL_ACCEPT_APPLICATION]: (state, action) => ({
        ...state, confirmAccept: null
    })
}, initialState)

export default teamEvents
