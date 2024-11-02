import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import {
  DbCreatePostInput,
  DbCreateProfileInput,
  DbCreateUserInput,
  DbContext,
  DbChangeProfileInput,
  DbChangeUserInput,
} from './types/graphql-db.js';
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
      resolve: async (source: { memberTypeId: string }, _args, context: DbContext) => {
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
      resolve: async (source: { id: string }, _args, context: DbContext) => {
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
      resolve: async (source: { id: string }, _args, context: DbContext) => {
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
      resolve: async (source: { id: string }, _args, context: DbContext) => {
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
      resolve: async (source: { id: string }, _args, context: DbContext) => {
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
      resolve: (_obj, _args, context: DbContext) => {
        return context.db.memberType.findMany();
      },
    },
    memberType: {
      type: MemberTypeType,
      args: {
        id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
      },
      resolve: async (_obj, args: { id: MemberTypeId }, context: DbContext) => {
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
      resolve: (_obj, _args, context: DbContext) => {
        return context.db.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, args: { id: string }, context: DbContext) => {
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
      resolve: (_obj, _args, context: DbContext) => {
        return context.db.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, args: { id: string }, context: DbContext, _info) => {
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
      resolve: (_obj, _args, context: DbContext) => {
        return context.db.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_obj, args: { id: string }, context: DbContext) => {
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

const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  },
});

const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  },
});

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const MutationsType = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: (_obj, args: { dto: DbCreateUserInput }, context: DbContext) => {
        const data = context.db.user.create({
          data: args.dto,
        });
        return data;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: (
        _obj,
        args: {
          dto: DbCreateProfileInput;
        },
        context: DbContext,
      ) => {
        const data = context.db.profile.create({
          data: args.dto,
        });
        return data;
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: (_obj, args: { dto: DbCreatePostInput }, context: DbContext) => {
        const data = context.db.post.create({
          data: args.dto,
        });
        return data;
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: (_obj, args: DbChangeProfileInput, context: DbContext) => {
        const data = context.db.profile.update({
          where: { id: args.id },
          data: args.dto,
        });
        return data;
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: (_obj, args: DbChangeUserInput, context: DbContext) => {
        const data = context.db.user.update({
          where: { id: args.id },
          data: args.dto,
        });
        return data;
      },
    },
  }),
});

export const ArtistSchema: GraphQLSchema = new GraphQLSchema({
  query: RootQueryTypeType,
  mutation: MutationsType,
});
