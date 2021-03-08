import { ApolloServer } from "apollo-server-micro";
import { schema } from "graphql/schema";
import { NextApiHandler, NextApiRequest, PageConfig } from "next";
import { getSignInUrl, setNextAuthUrl } from "../utils/nextAuth";
import { createContext } from "./context";
import { EnhancedNextApiRequest, Token } from "./typings";
import jwt from "next-auth/jwt";
import { isError, isNull } from "lodash";

const secret = process.env.JWT_SECRET;

const server = new ApolloServer({
  context: createContext,
  schema,
  introspection: true,

  tracing: process.env.NODE_ENV === "development",
  playground: {
    settings: {
       // Needed for auth
      // Docs: https://github.com/prisma/graphql-playground
      ["request.credentials"]: "same-origin",
    },
  },
  debug: true,
});


const apolloHandler = server.createHandler({
  disableHealthCheck: true,
  path: "/api/graphql",
});

export const handler: NextApiHandler = async (req, res) => {
  setNextAuthUrl(req);
  const token = await getToken<Token>({ req, secret });

  if (isError(token)) {
    return res.status(401).end();
  }
  if (isPlaygroundRequest(req)) {
    if (token) {
      return apolloHandler(req, res);
    } else {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      return res.send(
        `Hi! Please <a href="${getSignInUrl(
          req.headers.host!
        )}">sign in</a> in order to access the API Playground App. Once loaded you must add your Bearer token (found in the "next-auth.session-token" cookie) to the Playground headers like so: '{"Authorization": "Bearer <YOUR TOKEN HERE>" }'`
      );
    }
  }
  if (isNull(token)) {
    return res.status(401).end();
  }

  // Attach session to request so that it can be added to the graphql context later.
  (req as EnhancedNextApiRequest).token = token;
  (req as EnhancedNextApiRequest).user = {
    id: Number(token.sub),
  };

  return apolloHandler(req, res);
};

// Apollo Server Micro takes care of body parsing
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

async function getToken<Token extends object>({
  req,
  secret,
}: {
  req: NextApiRequest;
  secret: string;
}) {
  try {
    const token: null | Token = (await jwt.getToken({ req, secret })) as any;
    return token;
  } catch (error) {
    return error as Error;
  }
}

function isPlaygroundRequest(req: NextApiRequest): boolean {
  return (
    req.method === "GET" &&
    req.headers.accept?.includes("text/html") !== undefined
  );
}
