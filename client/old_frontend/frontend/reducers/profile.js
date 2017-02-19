import { handleActions } from 'redux-actions'
import { actionTypes as reduxFormActions } from 'redux-form'
import actions from 'actions/profile'
import myteamsActions from 'actions/memberships'

const initialState = {
    bracketOptions: [],
    regionOptions: [],
    roleOptions: [],
    player: {},
    changesSaved: false,
    isLoading: false,
    lastUpdated: null
}

// TODO: Break up into sub-reducers
const reducer = handleActions({
    [actions.REQUEST_BRACKET_OPTIONS]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_BRACKET_OPTIONS]: (state, action) => ({
        ...state, bracketOptions: action.payload, isLoading: false,
        lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_REGION_OPTIONS]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_REGION_OPTIONS]: (state, action) => ({
        ...state, regionOptions: action.payload, isLoading: false,
        lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_ROLE_OPTIONS]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_ROLE_OPTIONS]: (state, action) => ({
        ...state, roleOptions: action.payload, isLoading: false,
        lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_PLAYER_INFO]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_PLAYER_INFO]: (state, action) => ({
        ...state, player: action.payload, isLoading: false,
        lastUpdated: action.meta.receivedAt
    }),
    [actions.REQUEST_SUBMIT_PLAYER_INFO]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_SUBMIT_PLAYER_INFO]: (state, action) => {
        let newState = {
            ...state, isLoading: false, lastUpdated: action.meta.receivedAt
        }
        if (!action.error) {
            newState.changesSaved = true
            newState.player = action.payload
        }
        return newState
    },
    [myteamsActions.RECEIVE_CREATE_TEAM]: (state, action) => ({
        ...state, player: {
            ...state.player,
            teams: [...state.player.teams, action.payload]
        }
    }),
    [myteamsActions.RECEIVE_DELETE_TEAM]: (state, action) => ({
        ...state, player: {
            ...state.player,
            teams: state.player.teams.filter(team => team.id != action.payload)
        }
    }),
    [reduxFormActions.INITIALIZE]: (state, action) => {
        console.log('handle initialize', state, action)
        return {
            ...state, changesSaved: action.form == 'profile' ? false : state.changesSaved
        }
    }
}, initialState)

export default reducer
