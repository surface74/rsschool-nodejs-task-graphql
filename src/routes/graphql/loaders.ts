import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';
import {
  LoaderMemberType,
  LoaderPost,
  LoaderProfile,
  LoaderUser,
} from './types/loaders.js';

const getUser = async (db: PrismaClient, ids: readonly unknown[]) => {
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

const getPost = async (db: PrismaClient, ids: readonly unknown[]) => {
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

const getProfile = async (db: PrismaClient, ids: readonly unknown[]) => {
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

const getMemberType = async (db: PrismaClient, ids: readonly unknown[]) => {
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

const getManyUsers = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const data = (await db.user.findMany()) as (LoaderUser | null)[];

  return [data];
};

const getManyPosts = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const data = (await db.post.findMany()) as (LoaderPost | null)[];

  return [data];
};

const getManyProfiles = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const data = (await db.profile.findMany()) as (LoaderProfile | null)[];

  return [data];
};

const getManyMemberTypes = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const data = (await db.memberType.findMany()) as (LoaderMemberType | null)[];

  return [data];
};

export const createLoaders = (db: PrismaClient) => {
  return {
    users: new DataLoader(async (ids) => getUser(db, ids)),
    posts: new DataLoader(async (ids) => getPost(db, ids)),
    profiles: new DataLoader(async (ids) => getProfile(db, ids)),
    memberTypes: new DataLoader(async (ids) => getMemberType(db, ids)),

    manyUsers: new DataLoader(async (ids) => getManyUsers(db, ids)),
    manyPosts: new DataLoader(async (ids) => getManyPosts(db, ids)),
    manyProfiles: new DataLoader(async (ids) => getManyProfiles(db, ids)),
    manyMemberTypes: new DataLoader(async (ids) => getManyMemberTypes(db, ids)),
  };
};
