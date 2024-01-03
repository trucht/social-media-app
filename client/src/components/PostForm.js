import React from 'react'
import { Button, Form } from 'semantic-ui-react';
import gql from "graphql-tag"
import { useMutation } from '@apollo/client';

import { useForm } from '../util/hooks'
import { FETCH_POST_QUERY } from '../util/graphql';

const PostForm = () => {

 const { values, onChange, onSubmit } = useForm(createPostCallback, {
  body: ''
 })

 const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
  variables: values,
  update: (proxy, result) => {
   const data = proxy.readQuery({
    query: FETCH_POST_QUERY
   });

   proxy.writeQuery({
    query: FETCH_POST_QUERY,
    data: {
     getPosts: [result.data.createPost, ...data.getPosts]
    }
   });

   values.body = '';
  },
  onError: (err) => {
   console.error(err);
  }
 });

 console.log("🚀 ~ file: PostForm.js:29 ~ PostForm ~ error:", error)

 function createPostCallback() {
  createPost();
 }

 return (
  <Form onSubmit={onSubmit}>
   <h2>Create a post:</h2>
   <Form.Field>
    <Form.Input placeholder="Hi world!" name="body" onChange={onChange} value={values.body} />
    <Button type="submit" color="teal">
     Submit
    </Button>
   </Form.Field>
  </Form>
 )
}

const CREATE_POST_MUTATION = gql`
mutation createPost($body: String!) {
 createPost(body: $body) {
  id body createdAt username
  likes {
   id username createdAt
  }
  likeCount
  comments {
   id body username createdAt
  }
  commentCount
 }
} 
`;
export default PostForm