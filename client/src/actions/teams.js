import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { browserHistory } from 'react-router'
import { createUrl, metaGenerator } from 'utils'
import { GET, POST } from 'utils/api'

const actions = keyMirror({
    REQUEST_TEAM: null,
    RECEIVE_TEAM: null,
    REQUEST_SUBMIT_CREATE_TEAM: null,
    RECEIVE_SUBMIT_CREATE_TEAM: null
})
export default actions

// async : need for api requests
export const requestTeam = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM)(id))
    const { teams } = getState().teams
    if (Object.keys(teams).includes(id)) {
        const team = teams[id]
        if (!team.isLoading && team.lastUpdated) {
            return dispatch(createAction(actions.RECEIVE_TEAM, null, metaGenerator)(
                { result: teams[id].team, id }
            ))
        }
    }
    const url = createUrl(`/api/teams/${id}/`)
    // then : how you finish a promise (start and finish later (async))
    return GET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving team.')
        return dispatch(createAction(actions.RECEIVE_TEAM, null, metaGenerator)(
            { result: payload, id }
        ))
    }))
}

export const submitCreateTeam = data => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_SUBMIT_CREATE_TEAM))
    const { auth: { authToken } } = getState()
    if (authToken) {
        return POST(createUrl(`/api/teams/`), authToken, data).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error('Error creating team.')
                dispatch(createAction(actions.RECEIVE_SUBMIT_CREATE_TEAM, null, metaGenerator)(payload))
                if (response.ok) {
                    browserHistory.push(`/teams/manage/${json.id}`)
                }
                return ({ response, json })
            })
        )
    }
}
