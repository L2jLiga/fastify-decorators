import { app } from './index.js';

const host = '127.0.0.1';
const port = 3003;

app.listen({ port, host }, (error, address) => {
  if (error != null) {
    console.error(error);
    process.exit(-1);
  }
  console.log(`Application start and listening at ${address}`);
  console.log(`Available routes: \n${app.printRoutes()}`);
});
