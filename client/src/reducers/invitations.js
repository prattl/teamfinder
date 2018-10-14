import { handleActions } from "redux-actions";
import actions from "actions/player";
import teamActions from "actions/teams";
import { actionTypes as reduxFormActions } from "redux-form";

const initialState = {
  invitations: {},
  isLoading: false,
  lastUpdated: null
};

const player = handleActions({}, initialState);

export default player;
