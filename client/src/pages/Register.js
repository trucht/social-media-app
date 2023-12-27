import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useNavigate } from 'react-router-dom';

const Register = (props) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const [addUser, { loading }] = useMutation(REGISTER_MUTATION, {
    update(_, result) {
      console.log(result);
      navigate('/');
    },
    onError(err) {
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        setErrors(err.graphQLErrors[0].extensions.errors);
      } else {
        console.error("Unexpected error:", err);
      }
    },
    variables: values
  })

  const onSubmit = (event) => {
    event.preventDefault();
    addUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1 className="page-title">Register</h1>
        <Form.Input
          type="text"
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange} />
        <Form.Input
          type="email"
          label="Email"
          placeholder="Email..."
          name="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange} />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange} />
        <Form.Input
          type="password"
          label="Confirm assword"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange} />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <div className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const REGISTER_MUTATION = gql`
  mutation Register(    
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register