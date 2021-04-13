import { PrismaClient } from "@prisma/client";
import prisma from "lib/prisma";
import { EnhancedNextApiRequest } from "./typings";

import { NextApiResponse } from "next";

export type Context = {
  user: EnhancedNextApiRequest["user"];
  prisma: PrismaClient;
};

export async function createContext({
  req,
}: {
  req: EnhancedNextApiRequest;
  res: NextApiResponse;
}): Promise<Context> {
  return {
    user: req.user,
    prisma,
  };
}
