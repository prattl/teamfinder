import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import fetch from 'isomorphic-fetch'

const actions = keyMirror({
    REQUEST_FIXTURE: null,
    RECEIVE_FIXTURE: null
})
export default actions


export const requestFixture = fixtureType => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_FIXTURE)(fixtureType))
    const { endpoint } = getState().fixtures[fixtureType]
    return fetch(createUrl(endpoint), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving fixture.')
        return dispatch(createAction(actions.RECEIVE_FIXTURE, null, metaGenerator)({fixtureType, json: payload}))
    }))
}

export const requestAllFixtures = () => (dispatch, getState) => (
    Object.keys(getState().fixtures).map(fixtureType => dispatch(requestFixture(fixtureType)))
)

export const requestAllFixturesIfNeeded = () => (dispatch, getState) => {
    return Object.keys(getState().fixtures).map(fixtureType => {
        const fixture = getState().fixtures[fixtureType]
        if (!fixture.isLoading && !fixture.lastUpdated) {
            return dispatch(requestFixture(fixtureType))
        }
        return undefined
    })
}
