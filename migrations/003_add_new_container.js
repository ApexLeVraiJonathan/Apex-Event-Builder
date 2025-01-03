export const up = async (client, database, params = {}) => {
  const { containerName, partitionKey = '/id', indexes = [] } = params;

  if (!containerName) {
    throw new Error('Container name is required');
  }

  // Create new container
  await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: [partitionKey] },
    indexingPolicy: {
      indexingMode: 'consistent',
      includedPaths: indexes.map((path) => ({ path: `/${path}/?` })),
    },
  });
};

export const down = async (client, database, params = {}) => {
  const { containerName } = params;

  if (!containerName) {
    throw new Error('Container name is required');
  }

  await database.container(containerName).delete();
};
