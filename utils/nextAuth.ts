import { NextApiRequest } from "next";

export const NEXTAUTH_JWT_SECRET_ENVAR_NAME = "NEXTAUTH_JWT_SECRET";

/**
 * Setup the NEXTAUTH_URL envar based on the request header.
 *
 * https://github.com/nextauthjs/next-auth/issues/969
 */
export function setNextAuthUrl(req: NextApiRequest) {
  let protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const host = req.headers["host"];

  if (!host) {
    throw new Error(
      `The request has no host header which breaks authentication and authorization.`
    );
  }

  process.env.NEXTAUTH_URL = `${protocol}://${host}`;
}

export function getSignInUrl(host: string): string {
  return `/api/auth/signin?callbackUrl=${host}`;
}
