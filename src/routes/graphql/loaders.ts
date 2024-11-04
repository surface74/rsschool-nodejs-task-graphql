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
  const data = (await db.user.findMany()) as (LoaderUser | null)[];

  return [data];
};

const getAllPosts = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const data = (await db.post.findMany()) as (LoaderPost | null)[];

  return [data];
};

const getAllProfiles = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const data = (await db.profile.findMany()) as (LoaderProfile | null)[];

  return [data];
};

const getAllMemberTypes = async (db: PrismaClient, _ids: readonly unknown[]) => {
  const data = (await db.memberType.findMany()) as (LoaderMemberType | null)[];

  return [data];
};

export const createLoaders = (db: PrismaClient) => {
  return {
    users: new DataLoader(async (ids) => getUsers(db, ids)),
    posts: new DataLoader(async (ids) => getPosts(db, ids)),
    profiles: new DataLoader(async (ids) => getProfiles(db, ids)),
    memberTypes: new DataLoader(async (ids) => getMemberTypes(db, ids)),

    allUsers: new DataLoader(async (ids) => getAllUsers(db, ids)),
    allPosts: new DataLoader(async (ids) => getAllPosts(db, ids)),
    allProfiles: new DataLoader(async (ids) => getAllProfiles(db, ids)),
    allMemberTypes: new DataLoader(async (ids) => getAllMemberTypes(db, ids)),
  };
};
