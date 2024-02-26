import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useState, useRef } from 'react';
import { Button, Card, Grid, GridColumn, Image, Form } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { useNavigate, useParams } from 'react-router-dom';


const SinglePost = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const commentInputRef = useRef(null);
  const [comment, setComment] = useState('');

  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('')
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment
    }
  })

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error loading post: {error.message}</p>;


  function deletePostCallback() {
    navigate('/');
  }

  let postMarkup;
  if (!data.getPost) {
    postMarkup = <p>Loading post..</p>
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              floated='right'
            />
          </Grid.Column>
          <GridColumn width={10}></GridColumn>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likeCount, likes }} />
              <Button basic
                as={"div"}
                color='blue'
                labelPosition='right'
                label={{ basic: true, color: 'blue', pointing: 'left', content: commentCount }}
                onClick={() => { console.log('Comment on post') }}
                icon="comments"
              />

              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          {user && (
            <Card fluid>
              <Card.Content>
                <Form>
                  <div className='ui action input fluid'>
                    <input type="text" placeholder='Comment...' name="comment" value={comment} onChange={event => setComment(event.target.value)} ref={commentInputRef}/>
                    <button type="submit" className='ui button' disabled={comment.trim() === ''} onClick={submitComment}>
                      Submit
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>
          )}
          {comments.map(comment => (
            <Card fluid key={comment.id}>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={id} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Grid.Row>
      </Grid >
    )
  }

  return postMarkup
}

const SUBMIT_COMMENT_MUTATION = gql`
mutation($postId: String!, $body: String!) {
  createComment(postId: $postId, body: $body) {
    id
    comments {
      id body createdAt username
    }
    commentCount
  }
}
`

const FETCH_POST_QUERY = gql`
 query($postId: ID!) {
  getPost(postId: $postId) {
    id 
    body
    createdAt
    username 
    likeCount
    likes {
      username
    }
    commentCount
    comments {
      id
      username
      createdAt
      body
    }
  } 
 }
`

export default SinglePost;