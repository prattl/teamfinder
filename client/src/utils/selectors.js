import { createSelector } from 'reselect'

export const authSelector = createSelector(
    state => state.auth,
    auth => (auth)
)

export const fixturesSelector = createSelector(
    state => state.fixtures,
    fixtures => (fixtures)
)

export const positionsSelector = createSelector(
    state => state.fixtures.positions,
    positions => positions
)

export const playerSelector = createSelector(
    state => state.player,
    player => (player)
)

export const playerSearchSelector = createSelector(
    state => state.playerSearch,
    playerSearch => (playerSearch)
)

export const teamsSelector = createSelector(
    state => state.teams,
    teams => (teams)
)

export const teamSearchSelector = createSelector(
    state => state.teamSearch,
    teamSearch => (teamSearch)
)

