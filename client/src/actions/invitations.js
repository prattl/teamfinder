import { createAction } from "redux-actions";
import keyMirror from "keymirror";
import { createUrl, metaGenerator } from "utils";
import { GET, PATCH, POST } from "utils/api";

const actions = keyMirror({
  REQUEST_INVITATIONS_FOR_SELF: null,
  RECEIVE_INVITATIONS_FOR_SELF: null,
  REQUEST_INVITATIONS_FOR_TEAM: null,
  RECEIVE_INVITATIONS_FOR_TEAM: null
});
export default actions;

export const requestInvitationsForSelf = () => (dispatch, getState) => {
  dispatch(createAction(actions.REQUEST_INVITATIONS_FOR_SELF)());
  const {
    auth: { authToken },
    player: {
      player: { id }
    }
  } = getState();
  return GET(createUrl(`/api/invitations/?player=${id}`), authToken).then(
    response =>
      response.json().then(json => {
        const payload = response.ok
          ? json
          : new Error("Error retrieving own invitations.");
        return dispatch(
          createAction(
            actions.RECEIVE_INVITATIONS_FOR_SELF,
            null,
            metaGenerator
          )(payload)
        );
      })
  );
};

export const requestInvitationsForTeam = teamId => (dispatch, getState) => {
  dispatch(createAction(actions.REQUEST_INVITATIONS_FOR_TEAM)(teamId));
  const {
    auth: { authToken }
  } = getState();
  return GET(createUrl(`/api/invitations/?team=${teamId}`), authToken).then(
    response =>
      response.json().then(json => {
        const payload = response.ok
          ? json
          : new Error("Error retrieving team invitations.");
        return dispatch(
          createAction(
            actions.RECEIVE_INVITATIONS_FOR_TEAM,
            null,
            metaGenerator
          )(payload)
        );
      })
  );
};
