export const up = async (client, database) => {
  // Create tournamentProviders container
  await database.containers.createIfNotExists({
    id: 'tournamentProviders',
    partitionKey: { paths: ['/id'] },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/region/?',
        },
        {
          path: '/url/?',
        },
        {
          path: '/createdAt/?',
        },
      ],
    },
  });

  // Create tournaments container
  await database.containers.createIfNotExists({
    id: 'tournaments',
    partitionKey: { paths: ['/id'] },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/providerId/?',
        },
        {
          path: '/name/?',
        },
        {
          path: '/createdAt/?',
        },
      ],
    },
  });

  // Create tournamentCodes container
  await database.containers.createIfNotExists({
    id: 'tournamentCodes',
    partitionKey: { paths: ['/id'] },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/tournamentId/?',
        },
        {
          path: '/code/?',
        },
        {
          path: '/createdAt/?',
        },
      ],
    },
  });

  // Create teamWebhooks container
  await database.containers.createIfNotExists({
    id: 'teamWebhooks',
    partitionKey: { paths: ['/id'] },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/tournamentId/?',
        },
        {
          path: '/teamName/?',
        },
        {
          path: '/createdAt/?',
        },
      ],
    },
  });

  // Create gameCallbacks container
  await database.containers.createIfNotExists({
    id: 'gameCallbacks',
    partitionKey: { paths: ['/id'] },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/gameId/?',
        },
        {
          path: '/shortCode/?',
        },
        {
          path: '/createdAt/?',
        },
      ],
    },
  });

  // Create gameResults container
  await database.containers.createIfNotExists({
    id: 'gameResults',
    partitionKey: { paths: ['/id'] },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: [
        {
          path: '/gameId/?',
        },
        {
          path: '/tournamentId/?',
        },
        {
          path: '/createdAt/?',
        },
      ],
    },
  });
};

export const down = async (client, database) => {
  // Delete containers if rollback needed
  await database.container('tournamentProviders').delete();
  await database.container('tournaments').delete();
  await database.container('tournamentCodes').delete();
  await database.container('teamWebhooks').delete();
  await database.container('gameCallbacks').delete();
  await database.container('gameResults').delete();
};
