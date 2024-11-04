import DataLoader from 'dataloader';

export type LoaderUser = {
  id: string;
  name: string;
  balance: number;
};

export type LoaderPost = {
  id: string;
  title: string;
  content: string;
  authorId: string;
};

export type LoaderProfile = {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
};

export type LoaderMemberType = {
  id: string;
  discount: number;
  postsLimitPerMonth: number;
};

export type Loaders = {
  users: DataLoader<unknown, LoaderUser | null, unknown>;
  posts: DataLoader<unknown, LoaderPost | null, unknown>;
  profiles: DataLoader<unknown, LoaderProfile | null, unknown>;
  memberTypes: DataLoader<unknown, LoaderMemberType | null, unknown>;

  manyUsers: DataLoader<unknown, (LoaderUser | null)[], unknown>;
  manyPosts: DataLoader<unknown, (LoaderPost | null)[], unknown>;
  manyProfiles: DataLoader<unknown, (LoaderProfile | null)[], unknown>;
  manyMemberTypes: DataLoader<unknown, (LoaderMemberType | null)[], unknown>;
};
