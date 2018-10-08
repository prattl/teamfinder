import { createAction } from "redux-actions";
import keyMirror from "keymirror";
import { createUrl, metaGenerator } from "utils";
import { requestOwnPlayer } from "actions/player";
import { requestTeam } from "actions/teams";
import { GET, PATCH } from "utils/api";

const actions = keyMirror({
  REQUEST_PLAYER_INVITATIONS: null,
  RECEIVE_PLAYER_INVITATIONS: null,
  REQUEST_PLAYER_APPLICATIONS: null,
  RECEIVE_PLAYER_APPLICATIONS: null,

  CONFIRM_ACCEPT_INVITATION: null,
  CANCEL_ACCEPT_INVITATION: null,
  CONFIRM_REJECT_INVITATION: null,
  CANCEL_REJECT_INVITATION: null,

  REQUEST_UPDATE_PLAYER_APPLICATION_STATUS: null,
  RECEIVE_UPDATE_PLAYER_APPLICATION_STATUS: null,
  REQUEST_UPDATE_PLAYER_INVITATION_STATUS: null,
  RECEIVE_UPDATE_PLAYER_INVITATION_STATUS: null,

  CONFIRM_WITHDRAW_APPLICATION: null,
  CANCEL_WITHDRAW_APPLICATION: null
});
export default actions;

const PLAYER_EVENT_TYPES = {
  INVITATION: "invitations",
  APPLICATION: "applications"
};

export const requestPlayerInvitations = () => (dispatch, getState) => {
  dispatch(createAction(actions.REQUEST_PLAYER_INVITATIONS)());
  const url = createUrl(`/api/invitations/`);
  return GET(url, getState().auth.authToken).then(response =>
    response.json().then(json => {
      const payload = response.ok
        ? json
        : new Error("Error retrieving player invitations.");
      return dispatch(
        createAction(actions.RECEIVE_PLAYER_INVITATIONS, null, metaGenerator)(
          payload
        )
      );
    })
  );
};

export const requestPlayerApplications = () => (dispatch, getState) => {
  dispatch(createAction(actions.REQUEST_PLAYER_APPLICATIONS)());
  const url = createUrl(`/api/applications/`);
  return GET(url, getState().auth.authToken).then(response =>
    response.json().then(json => {
      const payload = response.ok
        ? json
        : new Error("Error retrieving player applications.");
      return dispatch(
        createAction(actions.RECEIVE_PLAYER_APPLICATIONS, null, metaGenerator)(
          payload
        )
      );
    })
  );
};

export const tryAcceptInvitation = createAction(
  actions.CONFIRM_ACCEPT_INVITATION
);
export const cancelAcceptInvitation = createAction(
  actions.CANCEL_ACCEPT_INVITATION
);
export const tryRejectInvitation = createAction(
  actions.CONFIRM_REJECT_INVITATION
);
export const cancelRejectInvitation = createAction(
  actions.CANCEL_REJECT_INVITATION
);
export const tryWithdrawApplication = createAction(
  actions.CONFIRM_WITHDRAW_APPLICATION
);
export const cancelWithdrawApplication = createAction(
  actions.CANCEL_WITHDRAW_APPLICATION
);

const updatePlayerEventStatus = eventType => status => eventId => (
  dispatch,
  getState
) => {
  const actionTypes =
    eventType === PLAYER_EVENT_TYPES.INVITATION
      ? [
          actions.REQUEST_UPDATE_PLAYER_INVITATION_STATUS,
          actions.RECEIVE_UPDATE_PLAYER_INVITATION_STATUS
        ]
      : [
          actions.REQUEST_UPDATE_PLAYER_APPLICATION_STATUS,
          actions.RECEIVE_UPDATE_PLAYER_APPLICATION_STATUS
        ];
  const [requestActionType, receiveActionType] = actionTypes;
  dispatch(createAction(requestActionType)(eventId));
  const {
    auth: { authToken }
  } = getState();
  if (authToken) {
    return PATCH(createUrl(`/api/${eventType}/${eventId}/`), authToken, {
      status
    }).then(response =>
      response.json().then(json => {
        const payload = response.ok ? json : new Error(json);
        dispatch(createAction(receiveActionType, null, metaGenerator)(payload));
        if (response.ok) {
          dispatch(requestOwnPlayer());
          dispatch(requestTeam(payload.team, true));
        }
      })
    );
  }
};

const updateApplicationStatus = updatePlayerEventStatus(
  PLAYER_EVENT_TYPES.APPLICATION
);
const updateInvitationStatus = updatePlayerEventStatus(
  PLAYER_EVENT_TYPES.INVITATION
);

export const acceptInvitation = updateInvitationStatus(2);
export const rejectInvitation = updateInvitationStatus(3);
export const withdrawApplication = updateApplicationStatus(5);
