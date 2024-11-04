import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, Source, validate } from 'graphql';
import { ArtistSchema } from './schema.js';
import depthLimit from 'graphql-depth-limit';
import { createLoaders } from './loaders.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const source = new Source(req.body.query);
      const ast = parse(source);
      const errors = validate(ArtistSchema, ast, [depthLimit(5)]);

      if (errors.length > 0) {
        return { errors };
      }

      const loaders = createLoaders(prisma);

      const result = await graphql({
        schema: ArtistSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { db: prisma, loaders },
      });

      return result;
    },
  });
};

export default plugin;
