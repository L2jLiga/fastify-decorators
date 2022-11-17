import createServerInstance from './server.js';

const app = async () => {
  const server = createServerInstance();

  try {
    await server.listen({
      port: 3000,
      host: '0.0.0.0',
    });
  } catch (e) {
    console.error(e);

    await server.close();
  }
};

app();
