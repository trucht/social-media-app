import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { Button, Confirm } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../util/graphql'

const DeleteButton = ({ postId, commentId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deletePostOrCommentMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      if(!commentId) {
        let data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        })
        let newData = data.getPosts.filter(p => p.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY, data: { getPosts: newData }
        });
      }


      if (callback) {
        callback()
      }
    },
    variables: {
      postId,
      commentId
    }
  })

  return (
    <>
      <Button
        basic
        color="red"
        icon="trash"
        onClick={() => { setConfirmOpen(true) }}
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrCommentMutation}
      />
    </>

  )
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId) 
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
export default DeleteButton