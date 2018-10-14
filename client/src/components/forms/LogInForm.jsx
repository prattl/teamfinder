import React, { Component } from "react";
import { Field, reduxForm, SubmissionError } from "redux-form";

import { login } from "actions/auth";

import { Alert, Button } from "react-bootstrap";
import { createInput } from "components/forms";

const submit = (values, dispatch) => {
  return dispatch(login(values)).then(({ response, json }) => {
    if (!response.ok) {
      const errors = {};
      if (json.hasOwnProperty("non_field_errors")) {
        errors._error = json.non_field_errors[0];
      }
      throw new SubmissionError(errors);
    }
  });
};

const EmailInput = createInput({ label: "Email", type: "email" });
const PasswordInput = createInput({ label: "Password", type: "password" });

class LogInForm extends Component {
  render() {
    const { error, handleSubmit, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        {error && <Alert bsStyle="danger">{error}</Alert>}
        <div>
          <Field name="email" component={EmailInput} />
        </div>
        <div>
          <Field name="password" component={PasswordInput} />
        </div>
        <div>
          <Button type="submit" disabled={submitting}>
            Log In
          </Button>
        </div>
      </form>
    );
  }
}

LogInForm = reduxForm({
  form: "logIn",
  onSubmit: submit
})(LogInForm);

export default LogInForm;
