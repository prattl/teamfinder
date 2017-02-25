import { handleActions } from 'redux-actions'
import actions from 'actions/teams'

const initialTeamState = {
    team: {},
    isLoading: false,
    lastUpdated: null
}

const initialState = {
    teams: {}
}

const teams = handleActions({
    [actions.REQUEST_TEAM]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload]: (Object.keys(state.teams).includes(action.payload)) ? state.teams[action.payload] : ({
                ...initialTeamState, isLoading: true
            })
        }
    }),
    [actions.RECEIVE_TEAM]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload.id]: {
                ...state.teams[action.payload.id],
                team: action.payload.result,
                isLoading: false,
                lastUpdated: action.meta.receivedAt
            }
        }
    })
}, initialState)

export default teams
