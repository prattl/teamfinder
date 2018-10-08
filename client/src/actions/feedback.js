import { createAction } from "redux-actions";
import keyMirror from "keymirror";
import { createUrl, metaGenerator } from "utils";
import { POST } from "utils/api";
import { notify } from "utils/actions";

const actions = keyMirror({
  OPEN_FEEDBACK_FORM: null,
  CLOSE_FEEDBACK_FORM: null,
  REQUEST_SUBMIT_FEEDBACK_FORM: null,
  RECEIVE_SUBMIT_FEEDBACK_FORM: null
});
export default actions;

export const openFeedbackForm = createAction(actions.OPEN_FEEDBACK_FORM);
export const closeFeedbackForm = createAction(actions.CLOSE_FEEDBACK_FORM);

export const submitFeedbackForm = data => (dispatch, getState) => {
  dispatch(createAction(actions.REQUEST_SUBMIT_FEEDBACK_FORM)());
  const { form: _, ...state } = getState();
  data.redux_state = state;
  return POST(
    createUrl("/api/feedback/"),
    getState().auth.authToken,
    data
  ).then(response =>
    response.json().then(json => {
      const payload = response.ok
        ? json
        : new Error("Error submitting feedback.");
      dispatch(
        createAction(actions.RECEIVE_SUBMIT_FEEDBACK_FORM, null, metaGenerator)(
          payload
        )
      );
      if (response.ok) dispatch(closeFeedbackForm());
      notify(response, "Feedback submitted. Thank you!");
      return { response, json };
    })
  );
};
