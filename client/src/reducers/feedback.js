import { handleActions } from 'redux-actions'
import actions from 'actions/feedback'

const initialState = {
    feedbackFormOpen: false
}

const feedback = handleActions({
    [actions.OPEN_FEEDBACK_FORM]: (state, action) => ({
        ...state, feedbackFormOpen: true
    }),
    [actions.CLOSE_FEEDBACK_FORM]: (state, action) => ({
        ...state, feedbackFormOpen: false
    })
}, initialState)

export default feedback
