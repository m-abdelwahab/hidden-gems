import { ApolloServer } from "apollo-server-micro";
import { schema } from "graphql/schema";
import { createContext } from "lib/prisma";
import { applyMiddleware } from "graphql-middleware";
import { permissions } from "graphql/permissions";


const apolloServer = new ApolloServer({
  context: createContext,
  schema: applyMiddleware(schema, permissions),
  tracing: process.env.NODE_ENV === "development",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: "/api/graphql",
});
