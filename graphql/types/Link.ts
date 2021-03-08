import { intArg, nonNull, objectType, stringArg, extendType } from "nexus";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.string("id");
    t.int("index");
    t.int("userId");
    t.string("title");
    t.string("url");
    t.string("description");
    t.string("imageUrl");
    t.string("category");
  },
});

export const Edge = objectType({
  name: "edges",
  definition(t) {
    t.string("cursor");
    t.field("node", {
      type: Link,
    });
  },
});

export const PageInfo = objectType({
  name: "pageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});

export const Response = objectType({
  name: "response",
  definition(t) {
    t.field("pageInfo", { type: PageInfo });
    t.list.field("edges", {
      type: Edge,
    });
  },
});

// get ALl Links
export const LinksQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("links", {
      type: "response",
      args: {
        limit: intArg(),
        skip: intArg(),
        cursor: stringArg(),
      },
      async resolve(_, args, ctx) {
        const firstQueryResults = await ctx.prisma.link.findMany({
          take: args.limit,
          orderBy: {
            index: "asc",
          },
        });
        const lastLinkInResults = firstQueryResults[3];
        const myCursor = lastLinkInResults.id;

        const secondQueryResults = await ctx.prisma.link.findMany({
          take: args.limit,
          skip: args.skip,
          cursor: {
            id: myCursor,
          },
          orderBy: {
            index: "asc",
          },
        });

        const result = {
          pageInfo: {
            endCursor: myCursor,
            hasNextPage: args.limit < secondQueryResults.length,
          },
          edges: secondQueryResults.map((link) => ({
            cursor: link.id,
            node: link,
          })),
        };

        return result;
      },
    });
  },
});
// get Unique Link
export const LinkByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("link", {
      type: "Link",
      args: { id: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        return ctx.prisma.link.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

// create link
export const CreateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createLink", {
      type: Link,
      args: {
        title: nonNull(stringArg()),
        url: nonNull(stringArg()),
        imageUrl: nonNull(stringArg()),
        category: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      async resolve(_parent, args, ctx) {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: ctx.user.id,
          },
        });
        const newLink = {
          title: args.title,
          url: args.url,
          imageUrl: args.imageUrl,
          category: args.category,
          description: args.description,
        };
        const isAdmin = await ctx.oso.isAllowed(user, null, newLink);
        if (!isAdmin) {
          throw new Error(`You do not have permission to perform action`);
        }

        return await ctx.prisma.link.create({
          data: newLink,
        });
      },
    });
  },
});
// update Link
export const UpdateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: intArg(),
        title: stringArg(),
        url: stringArg(),
        imageUrl: stringArg(),
        category: stringArg(),
        description: stringArg(),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.link.update({
          where: { id: args.id },
          data: {
            title: args.title,
            url: args.url,
            imageUrl: args.imageUrl,
            category: args.category,
            description: args.description,
          },
        });
      },
    });
  },
});
// // delete Link
export const DeleteLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.link.delete({
          where: { id: args.id },
        });
      },
    });
  },
});
