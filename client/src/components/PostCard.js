import React from 'react';
import { Card, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom'

const PostCard = ({ post: { id, username, body, createdAt, likeCount, commentCount } }) => {
 const likePost = () => {
  console.log("Hú")
 }

 const commentOnPost = () => {
  console.log("Hú")
 }
 
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
     <Button
      basic
      color='teal'
      content='Like'
      icon='heart'
      label={{ basic: true, color: 'teal', pointing: 'left', content: likeCount }}
      onClick={likePost}
     />
     <Button
      basic
      color='blue'
      content='Like'
      icon='comment'
      label={{ basic: true, color: 'blue', pointing: 'left', content: commentCount }}
      onClick={commentOnPost}
     />
    </div>
   </Card.Content>
  </Card >
 )
}

export default PostCard;