import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext } from 'react';
import { Button, Card, Grid, GridColumn, Image } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import { useNavigate, useParams } from 'react-router-dom';


const SinglePost = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  });

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
                <DeleteButton postId={id} callback={deletePostCallback}/>
              )}
            </Card.Content>
          </Card>
          {comments.map(comment => (
            <Card fuild key={comment.id}>
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
      </Grid>
    )
  }

  return postMarkup
}

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