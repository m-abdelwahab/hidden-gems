import { ApolloServer } from 'apollo-server-micro';

// we'll create these in a second!
import { schema } from 'graphql/schema';
import { createContext } from 'graphql/context';

const apolloServer = new ApolloServer({
  context: createContext,
  schema,
  tracing: process.env.NODE_ENV === 'development'
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default apolloServer.createHandler({
  path: '/api/graphql'
});