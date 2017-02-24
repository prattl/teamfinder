import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { fetchGET } from 'actions/playerSearch'
import { createUrl, metaGenerator } from 'utils'

const actions = keyMirror({
    REQUEST_TEAM: null,
    RECEIVE_TEAM: null
})
export default actions

export const requestTeam = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_TEAM)(id))
    const url = createUrl(`/api/teams/${id}/`)
    return fetchGET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving team.')
        return dispatch(createAction(actions.RECEIVE_TEAM, null, metaGenerator)(
            { result: payload, id }
        ))
    }))
}
