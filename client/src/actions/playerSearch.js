import { createAction } from 'redux-actions'
import keyMirror from 'keymirror'
import { createUrl, metaGenerator } from 'utils'
import { GET, POST } from 'utils/api'

const actions = keyMirror({
    REQUEST_PLAYER_SEARCH: null,
    RECEIVE_PLAYER_SEARCH: null,
    REQUEST_PLAYER: null,
    RECEIVE_PLAYER: null,
    REQUEST_NEXT_PAGE_OF_PLAYERS: null,
    RECEIVE_NEXT_PAGE_OF_PLAYERS: null,
    CONFIRM_INVITE_TO_TEAM: null,
    CANCEL_INVITE_TO_TEAM: null,
    REQUEST_INVITE_TO_TEAM: null,
    RECEIVE_INVITE_TO_TEAM: null
})
export default actions

export const requestPlayerSearch = (values) => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_PLAYER_SEARCH)())
    const { keywords, regions, positions, skill_bracket } = values
    let url = createUrl(`/api/players/?keywords=${keywords}&skill_bracket=${skill_bracket}`)
    regions.forEach(region => url += `&regions[]=${region}`)
    positions.forEach(position => url += `&positions[]=${position}`)
    return GET(url).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving player search results.')
        dispatch(createAction(actions.RECEIVE_PLAYER_SEARCH, null, metaGenerator)(payload))
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    }))
}

export const requestPlayer = id => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_PLAYER)())
    const { players } = getState().players
    const player = players[id]
    if (player) {
        return dispatch(createAction(actions.RECEIVE_PLAYER, null, metaGenerator)(player))
    } else {
        const url = createUrl(`/api/players/${id}/`)
        return GET(url).then(response => response.json().then(json => {
            // TODO: Implement NotFoundError
            const payload = response.ok ? json : new Error('Error retrieving player.')
            return dispatch(createAction(actions.RECEIVE_PLAYER, null, metaGenerator)(payload))
        }))
    }
}

export const requestNextPageOfPlayers = () => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_NEXT_PAGE_OF_PLAYERS)())
    const nextPage = getState().playerSearch.next
    return GET(nextPage).then(response => response.json().then(json => {
        const payload = response.ok ? json : new Error('Error retrieving next page of player search results.')
        dispatch(createAction(actions.RECEIVE_NEXT_PAGE_OF_PLAYERS, null, metaGenerator)(payload))
        if (!response.ok) {
            return Promise.reject(json)
        }
        return json
    }))
}

export const tryInviteToTeam = createAction(actions.CONFIRM_INVITE_TO_TEAM)
export const cancelInviteToTeam = createAction(actions.CANCEL_INVITE_TO_TEAM)

export const inviteToTeam = data => (dispatch, getState) => {
    dispatch(createAction(actions.REQUEST_INVITE_TO_TEAM)())
    const { auth: { authToken }, player: { player: { id } } } = getState()
    if (authToken) {
        return POST(createUrl('/api/invitations/'), authToken, { ...data, created_by: id }).then(
            response => response.json().then(json => {
                const payload = response.ok ? json : new Error('Error creating invitation')
                dispatch(createAction(actions.RECEIVE_INVITE_TO_TEAM, null, metaGenerator)(payload))
                return ({ response, json })
            })
        )
    }
}
