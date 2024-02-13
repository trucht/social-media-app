import moment from 'moment';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';

const PostCard = ({ post: { id, username, body, createdAt, likeCount, commentCount, likes } }) => {

 const { user } = useContext(AuthContext);


 return (
  <Card fluid>
   <Card.Content>
    <Image
     floated='right'
     size='mini'
     src='https://react.semantic-ui.com/images/avatar/large/molly.png'
    />
    <Card.Header>{username}</Card.Header>
    <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}
    </Card.Meta>
    <Card.Description>{body}</Card.Description>
   </Card.Content>
   <Card.Content extra>
    <div>
     <LikeButton user={user} post={{ id, likes, likeCount }} />
     <Button
      basic
      color='blue'
      content='Like'
      icon='comment'
      label={{ basic: true, color: 'blue', pointing: 'left', content: commentCount }}
      as={Link}
      to={`/posts/${id}`}
     />
     {user && user.username === username && (
      <Button
       basic
       color="red"
       icon="trash"
       onClick={() => { console.log("hú") }}
      >

      </Button>
     )}
    </div>
   </Card.Content>
  </Card >
 )
}

export default PostCard;