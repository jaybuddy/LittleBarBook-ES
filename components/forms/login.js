import React from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const RenderField = ({
  input,
  label,
  className,
  type,
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} className={className} />
    </div>
  </div>
);

RenderField.propTypes = {
  input: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.object,
};

const LoginForm = (props) => {
  const { handleSubmit } = props;
  return (
    <form onSubmit={handleSubmit}>
      <Form.Group controlId="email">
        <Field
          name="email"
          type="email"
          label="Email Address"
          className="large"
          component={RenderField}
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Field
          name="password"
          type="password"
          label="Password"
          className="large"
          component={RenderField}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Log me in!
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
};

const ReduxLoginForm = reduxForm({
  // a unique name for the form
  form: 'login',
})(LoginForm);

export default ReduxLoginForm;
