export type Item = {
  name: string;
  slug: string;
  description?: string;
  items?: Item[];
};

export const menus: Item[] = [
  {
    name: 'Web3 playground',
    slug: 'web3',
    items: [
      {
        name: 'Connection',
        slug: 'connection',
        description: 'Connection to wallet',
      },
      {
        name: 'Read',
        slug: 'read',
        description: 'Read from a Smart-Contract',
      },
      {
        name: 'Write',
        slug: 'write',
        description: 'Write to a Smart-Contract',
      },
      {
        name: 'Events',
        slug: 'events',
        description: 'Tests EVM events',
      },
      {
        name: 'Contracts',
        slug: 'contracts',
        description: 'Admin Smart-Contracts',
      },
    ],
  },
  {
    name: 'NextJs 13 Demo (App dir playground)',
    slug: 'demo',
    items: [
      {
        name: 'Home',
        slug: '',
        description:
          'Discover by playing with the new App dir',
      },
    ],
  },
];
