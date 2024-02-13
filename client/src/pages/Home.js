import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, GridColumn, Transition } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POST_QUERY } from '../util/graphql';

const Home = () => {
  const { loading, data, error } = useQuery(FETCH_POST_QUERY);
  const { user } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data</div>;
  }

  if (!data || !data.getPosts) {
    return <div>No data or getPosts found</div>;
  }

  const { getPosts: posts } = data;

  return (
    <main>
      <Grid columns={3} divided>
        <Grid.Row className="page-title">
          <h1 >Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {user
            && (
              <GridColumn>
                <PostForm />
              </GridColumn>
            )}
          <Transition.Group>
            {posts
              && posts.map(post => {
                return (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                )
              })}
          </Transition.Group>
        </Grid.Row>
      </Grid>
    </main>
  );
};



export default Home;
