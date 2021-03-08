import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "lib/prisma";

const authHandler: NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuth(req, res, options);
export default authHandler;

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    jwt: true,
  },
};
