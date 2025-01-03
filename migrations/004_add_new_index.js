export const up = async (client, database, params = {}) => {
  const { containerName, indexPath } = params;

  if (!containerName) {
    throw new Error('Container name is required');
  }
  if (!indexPath) {
    throw new Error('Index path is required');
  }

  const container = database.container(containerName);

  // Get current container definition
  const { resource: containerDef } = await container.read();

  // Check if index already exists
  const indexExists = containerDef.indexingPolicy.includedPaths.some(
    (path) => path.path === `/${indexPath}/?`,
  );

  if (indexExists) {
    console.log(`Index /${indexPath}/? already exists in ${containerName}`);
    return;
  }

  // Add new index to existing ones
  containerDef.indexingPolicy.includedPaths.push({
    path: `/${indexPath}/?`,
  });

  // Update container with new index
  await container.replace(containerDef);
};

export const down = async (client, database, params = {}) => {
  const { containerName, indexPath } = params;

  if (!containerName) {
    throw new Error('Container name is required');
  }
  if (!indexPath) {
    throw new Error('Index path is required');
  }

  const container = database.container(containerName);
  const { resource: containerDef } = await container.read();

  // Remove the index
  containerDef.indexingPolicy.includedPaths =
    containerDef.indexingPolicy.includedPaths.filter(
      (path) => path.path !== `/${indexPath}/?`,
    );

  await container.replace(containerDef);
};
