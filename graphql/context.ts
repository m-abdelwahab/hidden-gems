import { PrismaClient } from "@prisma/client";
import { join } from "path";
import prisma from "lib/prisma";
import { EnhancedNextApiRequest } from "./typings";
import { Oso } from "oso";
import { loadPolarFile } from "utils/oso";
import { NextApiResponse } from "next";

const oso = new Oso();

export type Context = {
  oso: Oso;
  user: EnhancedNextApiRequest["user"];
  prisma: PrismaClient;
};

export async function createContext(

  { req }: { req: EnhancedNextApiRequest; res: NextApiResponse }
): Promise<Context> {
  const polarFilePath = join(process.cwd(), "authorization.polar");
  await loadPolarFile(oso, polarFilePath);

  // In development always refresh Oso knowledge base
  // so that edits to our polices are picked up without having to
  // restart the Next dev process.
  if (process.env.NODE_ENV === "development") {
    oso.clearRules();
    await oso.loadFile(polarFilePath);
  }

  return {
    oso,
    user: req.user,
    prisma,
  };
}
