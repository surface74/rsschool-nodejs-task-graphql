import { PrismaClient } from '@prisma/client';

export type DbContext = {
  db: PrismaClient;
};

export type DbCreateProfileInput = {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
  userId: string;
};

export type DbCreateUserInput = {
  name: string;
  balance: number;
};

export type DbCreatePostInput = {
  title: string;
  content: string;
  authorId: string;
};

export type DbChangeProfileInput = {
  id: string;
  dto: {
    isMale?: boolean;
    yearOfBirth?: number;
    memberTypeId?: string;
  };
};

export type DbChangeUserInput = {
  id: string;
  dto: {
    name?: string;
    balance?: number;
  };
};

export type DbChangePostInput = {
  id: string;
  dto: {
    content?: string;
    title?: string;
  };
};

export type DbSubscribeToInput = {
  userId: string;
  authorId: string;
};
