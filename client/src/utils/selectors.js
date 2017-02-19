import { createSelector } from 'reselect'

export const fixturesSelector = createSelector(
    state => state.fixtures,
    fixtures => (fixtures)
)

export const playerSearchSelector = createSelector(
    state => state.playerSearch,
    playerSearch => (playerSearch)
)
