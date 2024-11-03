import DataLoader from 'dataloader';

export type Loaders = {
  users: DataLoader<
    unknown,
    {
      id: string;
      name: string;
      balance: number;
    } | null,
    unknown
  >;
};
