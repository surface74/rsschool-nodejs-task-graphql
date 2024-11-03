import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import { Loaders } from './types/loaders.js';

const getUser = async (db: PrismaClient, ids: readonly unknown[]) => {
  const result = new Array<{
    id: string;
    name: string;
    balance: number;
  } | null>();

  for (const uuid of ids) {
    const id = uuid as string;
    const data = await db.user.findUnique({
      where: { id },
    });
    result.push(data);
  }

  return result;
};

export const createLoaders = (db: PrismaClient): Loaders => {
  return {
    users: new DataLoader(async (ids) => getUser(db, ids)),
  };
};
