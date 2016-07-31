import { handleActions } from 'redux-actions'
import { actionTypes as reduxFormActions } from 'redux-form'
import actions from 'actions/players'

const initialState = {
    players: {},
    page: 0,
    nextPage: null,
    previousPage: null,
    isLoading: false,
    lastUpdated: null
}

const reducer = handleActions({
    [actions.REQUEST_PLAYERS]: (state, action) => ({
        ...state, isLoading: true
    }),
    [actions.RECEIVE_PLAYERS]: (state, action) => ({
        ...state, players: action.payload.players,
        isLoading: false,
        lastUpdated: action.meta.receivedAt
    })
}, initialState)

export default reducer
