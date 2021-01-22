import { enumType, intArg, nonNull, objectType } from "nexus";
import { extendType } from "nexus";
import { Link } from "./Link";
import prisma from "lib/prisma";


export const User = objectType({
  name: "User",
  definition(t) {
    t.int("id");
    t.string("name");
    t.string("email");
    t.string("image");
    t.field("role", { type: Role });
    t.list.field("favorites", {
      type: Link,
      resolve(_parent, _args, _ctx) {
        return prisma.user
          .findUnique({
            where: {
              id: _parent.id,
            },
          })
          .favorites();
      },
    });
  },
});

const Role = enumType({
  name: "Role",
  members: ["USER", "ADMIN"],
});


export const UsersQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.field("users", {
      type: User,
      async resolve(_parent, _args, ctx) {
        return prisma.user.findMany({});
      },
    });
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("user", {
      type: User,
      args: { id: nonNull(intArg()) },
      resolve(_parent, args, ctx) {
        return prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});
