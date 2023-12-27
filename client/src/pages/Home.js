import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

const Home = () => {
  const { loading, data, error } = useQuery(FETCH_POST_QUERY);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error('Error fetching data:', error);
    return <div>Error fetching data</div>;
  }

  // Check if the data object and getPosts property exist
  if (!data || !data.getPosts) {
    console.error('Data or getPosts is undefined:', data);
    return <div>No data or getPosts found</div>;
  }

  // Now you can safely access the posts array
  const { getPosts: posts } = data;

  return (
    <main>
      <Grid columns={3} divided>
        <Grid.Row className="page-title">
          <h1 >Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {posts.map(post => {
            return (
              <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                <PostCard post={post} />
              </Grid.Column>
            )
          })}
        </Grid.Row>
      </Grid>
    </main>
  );
};

const FETCH_POST_QUERY = gql`
  query {  
    getPosts {
      id body createdAt username likeCount
      likes {
        username
      }
      commentCount
      comments {
        id username createdAt body
      }
    }
  }
`;

export default Home;
