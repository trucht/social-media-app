import React, { useContext, useState } from 'react'
import { Form, Button } from 'semantic-ui-react';
import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

const Login = (props) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginCallback, {
    username: '',
    password: '',
  });


  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
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

  function loginCallback() {
    login();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1 className="page-title">Login</h1>
        <Form.Input
          type="text"
          label="Username"
          placeholder="Username..."
          name="username"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange} />
        <Form.Input
          type="password"
          label="Password"
          placeholder="Password..."
          name="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange} />
        <Button type="submit" primary>
          Login
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

const LOGIN_MUTATION = gql`
  mutation Login(    
    $username: String!
    $password: String!
  ) {
    login(
      username: $username
      password: $password
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login