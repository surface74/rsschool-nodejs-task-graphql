import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import {
  LoaderMemberType,
  LoaderPost,
  LoaderProfile,
  LoaderUser,
} from './types/loaders.js';

const getUsers = async (db: PrismaClient, ids: readonly unknown[]) => {
  const result = new Array<LoaderUser | null>();

  for (const uuid of ids) {
    const id = uuid as string;
    const data = await db.user.findUnique({
      where: { id },
    });
    result.push(data);
  }

  return result;
};

const getPosts = async (db: PrismaClient, ids: readonly unknown[]) => {
  const result = new Array<LoaderPost | null>();

  for (const uuid of ids) {
    const id = uuid as string;
    const data = await db.post.findUnique({
      where: { id },
    });
    result.push(data);
  }

  return result;
};

const getProfiles = async (db: PrismaClient, ids: readonly unknown[]) => {
  const result = new Array<LoaderProfile | null>();

  for (const uuid of ids) {
    const id = uuid as string;
    const data = await db.profile.findUnique({
      where: { id },
    });
    result.push(data);
  }

  return result;
};

const getMemberTypes = async (db: PrismaClient, ids: readonly unknown[]) => {
  const result = new Array<LoaderMemberType | null>();

  for (const uuid of ids) {
    const id = uuid as string;
    const data = await db.memberType.findUnique({
      where: { id },
    });
    result.push(data);
  }

  return result;
};

const getAllUsers = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const result = new Array<(LoaderUser | null)[]>();

  const data = await db.user.findMany();
  result.push(data);

  return result;
};

export const createLoaders = (db: PrismaClient) => {
  return {
    users: new DataLoader(async (ids) => getUsers(db, ids)),
    posts: new DataLoader(async (ids) => getPosts(db, ids)),
    profiles: new DataLoader(async (ids) => getProfiles(db, ids)),
    memberTypes: new DataLoader(async (ids) => getMemberTypes(db, ids)),

    allUsers: new DataLoader(async (ids) => getAllUsers(db, ids)),
  };
};
