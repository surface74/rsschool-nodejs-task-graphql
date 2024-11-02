import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { GraphQLContext } from './types/graphql-context.js';
import { MemberTypeId } from '../member-types/schemas.js';

const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const MemberTypeType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
  },
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: async (
        source: { memberTypeId: string },
        _args,
        context: GraphQLContext,
      ) => {
        const data = await context.db.memberType.findUnique({
          where: {
            id: source.memberTypeId,
          },
        });
        return data;
      },
    },
  },
});

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (source: { id: string }, _args, context: GraphQLContext) => {
        const data = await context.db.profile.findUnique({
          where: {
            userId: source.id,
          },
        });
        return data;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (source: { id: string }, _args, context: GraphQLContext) => {
        const data = await context.db.post.findMany({
          where: {
            authorId: source.id,
          },
        });
        return data;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source: { id: string }, _args, context: GraphQLContext) => {
        const data = await context.db.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: source.id,
              },
            },
          },
        });
        return data;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (source: { id: string }, _args, context: GraphQLContext) => {
        const data = await context.db.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: source.id,
              },
            },
          },
        });
        return data ?? new Array<typeof UserType>();
      },
    },
  }),
});

const RootQueryTypeType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberTypeType))),
      resolve: (_obj, _args, context: GraphQLContext) => {
        return context.db.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (_obj, args: { id: MemberTypeId }, context: GraphQLContext) => {
        const data = await context.db.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
        return data;
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: (_obj, _args, context: GraphQLContext) => {
        return context.db.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, args: { id: string }, context: GraphQLContext) => {
        const data = await context.db.user.findUnique({
          where: {
            id: args.id,
          },
        });
        return data;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: (_obj, _args, context: GraphQLContext) => {
        return context.db.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, args: { id: string }, context: GraphQLContext, _info) => {
        const data = await context.db.post.findUnique({
          where: {
            id: args.id,
          },
        });
        return data;
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve: (_obj, _args, context: GraphQLContext) => {
        return context.db.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, args: { id: string }, context: GraphQLContext) => {
        const data = await context.db.profile.findUnique({
          where: {
            id: args.id,
          },
        });
        return data;
      },
    },
  },
});

export const ArtistSchema: GraphQLSchema = new GraphQLSchema({
  query: RootQueryTypeType,
});
