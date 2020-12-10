import { app } from './app.js';

const address = '127.0.0.1';
const port = 3001;

app.listen(port, address, (error, address) => {
  if (error != null) {
    console.error(error);
    process.exit(-1);
  }
  console.log(`Application start and listening at ${address}`);
  console.log(`Available routes: \n${app.printRoutes()}`);
});
