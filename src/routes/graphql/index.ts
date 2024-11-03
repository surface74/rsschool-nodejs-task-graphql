import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { DocumentNode, graphql, parse, Source, validate } from 'graphql';
import { ArtistSchema } from './schema.js';
import depthLimit from 'graphql-depth-limit';

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

      const result = await graphql({
        schema: ArtistSchema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { db: prisma },
      });

      return result;
    },
  });
};

export default plugin;

// validationRules: [depthLimit(5)],
// Ivan Efimov (@py-cs) — 29.01.2023 19:33
// в самом конце ридми нужная ссылка. функция validate

// Anatoly (@spiderVS) — 30.01.2023 23:53
// Подскажите по последнему таску. Провалидировал я запрос(до вызова graphql),
// получил ошибку Depth limit.Не могу понять как ее пропихнуть дальше.Или я не на том этапе валидирую ?

// Maks Rafalko (@maks-rafalko) — 30.01.2023 23:54
// имхо, на том. Я с помощью fastify возвращал ее через reply.send() до вызова graphql
