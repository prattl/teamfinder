import { handleActions } from 'redux-actions'
import actions from 'actions/teams'
import { arrayToObject } from 'utils'

const initialTeamState = {
    team: {},
    isLoading: false,
    lastUpdated: true
}

const initialState = {
    teams: {}
}

const teams = handleActions({
    [actions.REQUEST_TEAM]: (state, action) => ({
        ...state,
        teams: {
            ...state.teams,
            [action.payload]: { ...initialTeamState }
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
