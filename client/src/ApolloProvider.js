import React from 'react'
import App from './App'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({ uri: 'http://localhost:2410/graphql' })
console.log("🚀 ~ file: ApolloProvider.js:9 ~ httpLink:", httpLink)

const authLink = setContext(() => {
 const token = localStorage.getItem("jwtToken");
 return {
  headers: {
   Authorization: token ? `Bearer ${token}` : ''
  }
 }
})
console.log("🚀 ~ file: ApolloProvider.js:18 ~ authLink ~ authLink:", authLink)

const client = new ApolloClient({
 link: authLink.concat(httpLink),
 cache: new InMemoryCache()
})

export default (
 <ApolloProvider client={client}>
  <App />
 </ApolloProvider>
)