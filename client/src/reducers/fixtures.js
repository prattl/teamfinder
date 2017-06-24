import { handleActions } from 'redux-actions'
import actions from 'actions/fixtures'
import { arrayToObject } from 'utils'

const initialFixtureState = endpoint => ({
    items: {},
    endpoint,
    isLoading: false,
    lastUpdated: null
})

const initialState = {
    positions: initialFixtureState('/api/positions/'),
    regions: initialFixtureState('/api/regions/'),
}

const fixtures = handleActions({
    [actions.REQUEST_FIXTURE]: (state, action) => ({
        ...state,
        [action.payload]: {
            ...state[action.payload],
            isLoading: true
        }
    }),
    [actions.RECEIVE_FIXTURE]: (state, action) => ({
        ...state,
        [action.payload.fixtureType]: {
            ...state[action.payload.fixtureType],
            items: arrayToObject(action.payload.json.results),
            isLoading: false,
            lastUpdated: action.meta.receivedAt
        }
    })
}, initialState)

export default fixtures
