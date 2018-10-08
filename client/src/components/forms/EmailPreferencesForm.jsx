import React, { Component } from "react";
import { Field, FieldArray, reduxForm, SubmissionError } from "redux-form";

import { submitEmailPreferences } from "actions/player";

import { Alert, Button } from "react-bootstrap";

const submit = (values, dispatch) => {
  return dispatch(submitEmailPreferences(values)).then(({ response, json }) => {
    if (!response.ok) {
      const errors = {};
      if (json.hasOwnProperty("non_field_errors")) {
        errors._error = json.non_field_errors[0];
      }
      throw new SubmissionError(errors);
    }
  });
};

const validate = values => {
  const errors = {};
  return errors;
};

const mapTagToLabel = [
  "Uncheck to stop receiving all emails",
  "Send me updates and new feature announcements",
  "Let me know when I'm invited to a team or a team I applied to has made a decision",
  "Let me know when somebody applies to my teams, or when someone I invited to my team has made a decision"
];

const renderEmailPreferences = ({ fields, meta: { touched, error } }) => (
  <div>
    {fields.map((emailPreference, index) => (
      <div key={index}>
        <div className="checkbox">
          <label>
            <Field
              name={`${emailPreference}.receive`}
              component="input"
              type="checkbox"
            />
            &nbsp;
            {mapTagToLabel[fields.get(index).tag]}
          </label>
        </div>
        <Field name={`${emailPreference}.id`} component="input" type="hidden" />
      </div>
    ))}
  </div>
);

class EmailPreferencesForm extends Component {
  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <fieldset>
          {error && <Alert bsStyle="danger">{error}</Alert>}
          <div>
            <FieldArray
              name="email_preferences"
              component={renderEmailPreferences}
            />
          </div>
          <div>
            <Button type="submit" disabled={submitting}>
              Save Changes
            </Button>
          </div>
        </fieldset>
      </form>
    );
  }
}

EmailPreferencesForm = reduxForm({
  form: "emailPreferences",
  validate,
  onSubmit: submit
})(EmailPreferencesForm);

export default EmailPreferencesForm;
