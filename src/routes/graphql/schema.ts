import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      testString: {
        type: GraphQLString,
        resolve: async () => {
          return 'Hello world';
        },
      },
    },
  }),
});
