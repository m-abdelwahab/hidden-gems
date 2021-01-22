import { rule, shield, and, not } from "graphql-shield";

const getSessionToken = (cookie) => {
  // console.log(cookie)
  return cookie.split(";")[2].trim().split("=")[1];
};

const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, ctx, info) => {
    const sessionToken = getSessionToken(ctx.req.headers.cookie);
    const user = await ctx.prisma.session.findUnique({
      where: { sessionToken },
    });
    if (user) {
      return true;
    }
  }
);

const isAdmin = rule({ cache: "contextual" })(
  async (parent, args, ctx, info) => {
    const sessionToken = getSessionToken(ctx.req.headers.cookie);
    
    const sessionUserId = await ctx.prisma.session.findUnique({
      where: { sessionToken },
      select: { userId: true },
    });

    const user = await ctx.prisma.user.findUnique({
      where: { id: sessionUserId.userId },
    });
    return user.role === "ADMIN";
  }
);

export const permissions = shield({
  Query: {
    user: and(isAuthenticated, isAdmin),
    users: and(isAuthenticated, isAdmin),
    links: not(isAuthenticated),
  },
  Mutation: {
    updateLink: and(isAuthenticated, isAdmin),
    createLink: and(isAuthenticated, isAdmin),
    deleteLink: and(isAuthenticated, isAdmin),
  },
});
