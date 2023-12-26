const { createServer } = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const mongoose = require('mongoose');
const cors = require('cors');

const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const schema = makeExecutableSchema({ typeDefs, resolvers });
const app = express();
const httpServer = createServer(app);

app.use(cors());

const wsServer = new WebSocketServer({
  noServer: true
});

const serverCleanup = useServer({ schema }, wsServer);


const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: "bounded",
  context: ({ req }) => ({ req }),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      serverWillStart: async () => ({
        async drainServer() {
          await serverCleanup.dispose();
        },
      }),
    },
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
      console.log('MongoDB connected');
      httpServer.on('upgrade', (request, socket, head) => {
        wsServer.handleUpgrade(request, socket, head, (webSocket) => {
          wsServer.emit('connection', webSocket, request);
        });
      });
      return httpServer.listen({ port: 2410 });
    })
    .then((res) => {
      console.log(`Server is running at http://localhost:2410${server.graphqlPath}`);
    });
}

startServer();
