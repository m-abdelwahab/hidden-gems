import { NextApiRequest } from "next"
import { Session } from "next-auth/client"

/**
 * https://next-auth-git-canary.nextauthjs.vercel.app/configuration/options#jwt
 */
export type Token = {
  name: string
  email: string
  picture: string
  sub: string
  iat: number
  exp: number
}

export type EnhancedNextApiRequest = NextApiRequest & {
  user: {
    id: number
  }
  session?: Session
  token?: Token
}
