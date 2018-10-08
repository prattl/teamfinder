import { createSelector } from "reselect";

// TODO: These all need to be namespaced
export const authSelector = createSelector(state => state.auth, auth => auth);

export const feedbackSelector = createSelector(
  state => state.feedback,
  feedback => feedback
);

export const fixturesSelector = createSelector(
  state => state.fixtures,
  fixtures => fixtures
);

export const positionsSelector = createSelector(
  state => state.fixtures.positions,
  positions => positions
);

export const playerSelector = createSelector(
  state => state.player,
  player => player
);

export const playersSelector = createSelector(
  state => state.players,
  players => players
);

export const playerSearchSelector = createSelector(
  state => state.playerSearch,
  playerSearch => playerSearch
);

export const teamsSelector = createSelector(
  state => state.teams,
  teams => teams
);

export const teamSearchSelector = createSelector(
  state => state.teamSearch,
  teamSearch => teamSearch
);
