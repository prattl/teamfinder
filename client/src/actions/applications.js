import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { GET, PATCH, POST } from 'utils/api'

const actions = keyMirror({
    REQUEST_APPLICATIONS_FOR_SELF: null,
    RECEIVE_APPLICATIONS_FOR_SELF: null,
    REQUEST_APPLICATIONS_FOR_TEAM: null,
    RECEIVE_APPLICATIONS_FOR_TEAM: null
})
export default actions

export const requestApplicationsForSelf = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_APPLICATIONS_FOR_SELF)())
    const { auth: { authToken }, player: { player: { id } } } = getState()
    return GET(createUrl(`/api/applications/?player=${id}`), authToken).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error retrieving own applications.')
            return dispatch(createAction(actions.RECEIVE_APPLICATIONS_FOR_SELF, null, metaGenerator)(payload))
        })
    )
}

export const requestApplicationsForTeam = teamId => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_APPLICATIONS_FOR_TEAM)(teamId))
    const { auth: { authToken } } = getState()
    return GET(createUrl(`/api/applications/?team=${teamId}`), authToken).then(
        response => response.json().then(json => {
            const payload = response.ok ? json : new Error('Error retrieving team applications.')
            return dispatch(createAction(actions.RECEIVE_APPLICATIONS_FOR_TEAM, null, metaGenerator)(payload))
        })
    )
}
