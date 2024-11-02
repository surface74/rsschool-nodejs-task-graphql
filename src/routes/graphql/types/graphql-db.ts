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
