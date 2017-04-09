import { handleActions } from 'redux-actions'
import actions from 'actions/player'
import teamActions from 'actions/teams'
// import { actionTypes as reduxFormActions } from 'redux-form'

const initialState = {
    player: {
        teams: []
    },
    changesSaved: false,
    isLoading: false,
    lastUpdated: null,
    teamApplyingTo : null
}

const player = handleActions({
    [actions.REQUEST_OWN_PLAYER]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_OWN_PLAYER]: (state, action) => ({
        ...state,
        player: action.error ? state.player : action.payload,
        isLoading: false, lastUpdated: action.meta.receivedAt
    }),
    [actions.RECEIVE_SUBMIT_PROFILE]: (state, action) => ({
        ...state,
        player: action.error ? state.player : action.payload
    }),
    // [reduxFormActions.SET_SUBMIT_SUCCEEDED]: (state, action) => ({
    //     ...state, changesSaved: action.meta.form === 'profile'
    // }),
    // [reduxFormActions.CHANGE]: (state, action) => ({
    //     ...state, changesSaved: action.meta.form === 'profile' ? false : state.changesSaved
    // }),
    [actions.DISMISS_CHANGES_SAVED]: (state, action) => ({
        ...state, changesSaved: false
    }),
    [teamActions.RECEIVE_SUBMIT_CREATE_TEAM]: (state, action) => ({
        ...state, player: {
            ...state.player,
            teams: action.error ? state.player.teams : [
                ...state.player.teams,
                action.payload
            ]
        }
    }),
    [actions.CONFIRM_APPLY_TO_TEAM]: (state, action) => ({
        ...state, player: {
            ...state.player,
            teamApplyingTo: action.payload
        }
    }),
    [actions.CANCEL_APPLY_TO_TEAM]: (state, action) => ({
        ...state, player: {
            ...state.player,
            teamApplyingTo: null
        }
    }),
    [actions.RECEIVE_SUBMIT_APPLICATION]: (state, action) => ({
        ...state, player: {
            ...state.player,
            teamApplyingTo: action.error ? state.player.teamApplyingTo : null
        }
    })
}, initialState)

export default player
